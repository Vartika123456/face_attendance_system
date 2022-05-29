from distutils.log import error
from fileinput import filename
from genericpath import exists
from socket import MsgFlag
from telnetlib import STATUS
from traceback import print_tb
from unittest import loader
from urllib import response
import MySQLdb
from flask import *
from datetime import datetime
import cv2
import os
from crypt import methods
from flask_mysqldb import MySQL
import yaml
import re
import base64
import io 
from PIL import Image
from werkzeug.utils import secure_filename
import face_recognition
import numpy as np
import time

app = Flask(__name__)

db=yaml.load(open('db.yaml'),Loader=yaml.FullLoader)

app.config['MYSQL_HOST'] = db['mysql_host']
app.config['MYSQL_USER'] = db['mysql_user']
app.config['MYSQL_PASSWORD'] = db['mysql_password']
app.config['MYSQL_DB'] = db['mysql_db']
app.config['SECRET_KEY'] = 'secret123'
app.config['SESSION_TYPE'] = 'filesystem'  
# app.config['UPLOAD_FOLDER'] = db['upload_folder']
mysql = MySQL(app)


path='./static/images/users'
path_admin='./static/images/admin/'

images =[]
classNames = []
myList=os.listdir(path)
encodeListKnown = []
classIDs=[]


user_details="create table if not exists userDetails(id int auto_increment not null primary key,adminId int ,address varchar(255), username varchar(255), phone varchar(255),email varchar (255),name varchar(255),image varchar(255), foreign key (adminId) references users(id) on delete cascade)"




def extract_images():
    for cls in myList:
            curImg = cv2.imread(f'{path}/{cls}')
            images.append(curImg)
            filenames=cls.split('_')
            print(filenames)
            classIDs.append(filenames[0])
            classNames.append(filenames[1])                  

            
def findEncodings(images):
    encodeList=[]
    for img in images:
        img=cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
        encode=face_recognition.face_encodings(img)[0]
        encodeList.append(encode)
    return encodeList



    

@app.route('/create_new_account')
def create_new_account():
    return render_template('signup.html')



@app.route('/')
def home():
   return render_template('home.html')



@app.route('/home')
def homepage():
   return render_template('home.html')



@app.route('/admin')
def admin():
    return render_template('admin.html')


@app.route('/login',methods=['GET','POST'])
def login():
    err_msg=''
    status=''

    if request.method=='POST' and 'username' in request.form and 'password' in request.form:
      
        username=request.form['username']
        password=request.form['password']
        cur=mysql.connection.cursor()
        try:
            cur.execute('select * from users  where username=%s and password=%s',(username,password))        
            account=cur.fetchone()
            mainaccount=account
            print(account)
            if account:
                session['loggedin']=True
                session['id']=account[0]
                session['username']=account[3]
                session['name']=account[1]
                err_msg='Logged in successfully'
                status='success'
                cur.execute(user_details)
                mysql.connection.commit()
                cur.execute('select * from userDetails where adminId=%s',(session['id'],))
                account=cur.fetchone()
                if not account:
                    cur.execute('insert into userDetails(id,adminId,address,username,phone,email,name,image) values(%s,%s,%s,%s,%s,%s,%s,%s)',(session['id'],session['id'],'NULL',session['username'],'NULL',mainaccount[2],session['name'],'NULL'))
                    mysql.connection.commit()
                cur.close()
                return json.dumps({'status':status,'error':err_msg})
            else:
               
                status='failed'
                err_msg="Invalid credentials"
                cur.close()
                return json.dumps({'status':status,'error':err_msg})
        except:
            status='failed'
            err_msg="Database error"
            cur.close()
            return json.dumps({'status':status,'error':err_msg})
    else :
        status='failed'
        err_msg="Please fill all the fields"
        return json.dumps({'status':status,'error':err_msg})
   
@app.route('/user',methods=['GET','POST'])
def user():
    if request.method=='POST':
        name=request.form['emp_name']
        emp_ID=request.form['emp_id']
        class_key=request.form['class_key']
       

    return render_template('user.html')

@app.route('/signup',methods=['GET','POST'])
def signup():

    err_msg = ''
    status = ''
    if request.method=='POST':
        name=request.form['name']
        username=request.form['username']
        email=request.form['email']
        password=request.form['password']
        password1=request.form['confirm_password']
        cur=mysql.connection.cursor()
        cur.execute("create table if not exists users (id int auto_increment not null,name varchar(255),email varchar(255),username varchar(255),password varchar(255) not null, primary key (id))")
        cur.connection.commit()
        try:
            cur.execute("select * from users where username=%s",(username,))
            account = cur.fetchone()
            if account:
                status='failed'
                err_msg = 'Username already exists'
            elif not re.match(r'[^@]+@[^@]+\.[^@]+', email):
                status='failed'
                err_msg = 'Invalid email address'
            elif not re.match(r'[A-Za-z0-9]+', username):
                status='failed'
                err_msg = 'username must contain only characters and numbers'
            elif not username or not password or not email:
                status='failed'
                err_msg = 'Please fill out the form'
            elif password != password1:
                status='failed'
                err_msg = 'Passwords do not match'
            else:
                try:
                    cur.execute("insert into users(name,username,email,password) values(%s,%s,%s,%s)",(name,username,email,password))
                    mysql.connection.commit()

                    err_msg = 'Account created successfully'
                    status='success'
                except:
                    status='failed'
                    err_msg = 'Error creating account'
              
                cur.close()
        except:
            status='failed'
            err_msg = 'Database error'
    else:
        status='failed'
        err_msg = 'invalid request'

    return json.dumps({'status':status,'error':err_msg})
      
@app.route('/logout')
def logout():
    session.pop('loggedin',None)
    session.pop('id',None)
    session.pop('username',None)
    session.pop('name',None)
    return redirect(url_for('home'))


@app.route('/attendance',methods=['GET','POST'])
def attendance():
    extract_images()
    encodeListKnown=findEncodings(images)
    status=''
    err=''
    img=request.files['img']
    fname1=os.path.join('static/images/temp','temp.png')
    if img:
        
                    # print(fname1)
        img.save(fname1)
        img=cv2.imread(fname1)
        
        
    #display image
    # cv2.imshow('image',picture)

        try:
            img=cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
            facesCurFrame=face_recognition.face_locations(img)
            encodesCurFrame=face_recognition.face_encodings(img,facesCurFrame)
            # print(encodesCurFrame)
            for encodeFace,faceLoc in zip(encodesCurFrame,facesCurFrame):
                matches=face_recognition.compare_faces(encodeListKnown,encodeFace)
                faceDis=face_recognition.face_distance(encodeListKnown,encodeFace)
        
            if faceDis.size>0:
                matchIndex=np.argmin(faceDis)

                if matches[matchIndex]:
                    name=classNames[matchIndex]
                    idd=classIDs[matchIndex]
                    status='Present'
                    empID=idd          
        except:
            status='failed' 
            err='face not detected'
            empID=-1
        
        
        if empID==-1:
            err='Employee not found'
            status='success'
        else:
            if request.method=='POST':
                cur=mysql.connection.cursor()
                date=datetime.now()
                tablename=str(date.strftime('%B'))+str(date.year)+str(date.day)
                try:
                    try:
                        cur.execute("create table if not exists %s (empID int ,inTime bigint, primary key(empID) )"%(tablename))
                        mysql.connection.commit()
                        tablename=str(tablename)
                        try:
                            date1=datetime.now()
                            ts=int(round(datetime.timestamp(date1)*1000))
                            ts=int(ts)
                            cur.execute("select * from %s where empID=%s"%(tablename,empID))
                            account = cur.fetchone()
                            if account:
                                err='Employee already present'
                                status='success'
                            # print("insert into %s  values(%s,%s)"%(tablename,empID,ts))
                            else :
                                cur.execute("insert into %s   values(%s,%s)"%(tablename,empID,ts)) 
                                mysql.connection.commit()
                                status='success'
                                err='Attendance marked successfully'
                        except:
                            status='failed'
                            err='Attendance already marked or database error'
                    except:
                        status='failed'
                        err='Database error'
                    cur.close()
                except :
                    err='Attendance already marked or database error'
                    status='fail'
                    cur.close()
            else:
                err='request err'
                status='fail'
            os.remove(fname1)
    else:
        err='no image'
        status='fail'
    
    return json.dumps({'status':status,'error':err})


@app.route('/profile',methods=['GET','POST'])
def profile():
    status=''
    error=''
    img='https://mdbootstrap.com/img/Photos/Avatars/avatar.jpg'
    cur=mysql.connection.cursor()
    try:
        cur.execute(user_details)
        mysql.connection.commit()
        try:
            cur.execute("select * from userDetails where adminId=%s",(session['id'],))
            account=cur.fetchone()
            if account:

                status='success'
                error='Profile found'
                if account[7]!=None and account[7]!='NULL' and account[7]!=''  and account[7]!='null':
                    img=account[7]
                return json.dumps(
                    {
                        'status':status,
                        'error':error,
                         'data':{
                            'address':account[2],
                            'username':account[3],
                            'phone':account[4],
                            'email':account[5],
                            'name':account[6],
                            'img':img
                         }
                       

                    }
                )
            else:
                status='success'
                error='Profile not found'
                return json.dumps(
                    {
                        'status':status,
                        'error':error,
                        'data':{
                        'address':'',
                        'username':session['username'],
                        'phone':'',
                        'email':'',
                        'name': session['name'],
                        'img':img
                        }
                        

                    }
                )
        except:
            status='failed'
            error='Database error'
            return json.dumps({'status':status,'error':error})
    except:
        status='failed'
        error='Database error'
        return json.dumps({'status':status,'error':error})
@app.route('/edit_personal_info',methods=['POST'])
def edit_personal_info():
    status=''
    error=''
    img='https://mdbootstrap.com/img/Photos/Avatars/avatar.jpg'
    name=request.form['name']
    phone=request.form['phone']
    email=request.form['email']
    address=request.form['address']
    # print(request.form)
    cur=mysql.connection.cursor()
    try:
        cur.execute(user_details)
        mysql.connection.commit()
        try:
            cur.execute("select * from userDetails where adminId=%s",(session['id'],))
            account=cur.fetchone()
            if account:
                try:
                    cur.execute("update userDetails set address=%s,name=%s,phone=%s,email=%s where adminId=%s",(address,name,phone,email,session['id']))
                    mysql.connection.commit()
                    cur.execute("update users set name=%s,email=%s where id=%s",(name,email,session['id']))
                    mysql.connection.commit()
                    status='success'
                    session['name']=name
                    error='Profile updated successfully'
                    cur.execute("select * from userDetails where adminId=%s",(session['id'],))
                    account=cur.fetchone()
                    if account[7]!=None and account[7]!='NULL' and account[7]!=''  and account[7]!='null':
                        img=account[7]
                    return json.dumps(
                        {
                            'status':status,
                            'error':error,
                            'data':{
                            'address':account[2],
                            'username':account[3],
                            'phone':account[4],
                            'email':account[5],
                            'name':account[6],
                            'img':img
                            }
                        })
                except:
                    status='failed'
                    
                    error='Database error'
                    return json.dumps({'status':status,'error':error})
            else:
                status='success'
                error='Profile not found'
                return json.dumps(
                        {
                            'status':status,
                            'error':error,
                            'data':{
                            'address':'',
                            'username':session['username'],
                            'phone':'',
                            'email':'',
                            'name': session['name'],
                            'img':img
                            }
                        }
                )
        except:
            status='failed'
            error='Database error'
            return json.dumps({'status':status,'error':error})
    except:
        status='failed'
        error='Database error'
        return json.dumps({'status':status,'error':error})
            

@app.route('/change_password',methods=['GET','POST'])
def edit_password():
    status=''
    error=''
    # print(request.form)
    cur=mysql.connection.cursor()
    oldpass=request.form['oldPassword']
    password=request.form['password']
    confirmPassword=request.form['confirmPassword']
    cur.execute("select * from users where id=%s",(session['id'],))
    account=cur.fetchone()
    if account:
        if account[4]==oldpass:
            if password==confirmPassword:
                try:
                    cur.execute("update users set password=%s where id=%s",(password,session['id']))
                    mysql.connection.commit()
                    status='success'
                    error='Password updated successfully'
                except:
                    status='failed'
                    error='Database error'
            else:
                status='failed'
                error='Password and confirm password does not match'
        else:
            status='failed'
            error='Old password does not match'
    else:
        status='failed'
        error='Account not found'
    return json.dumps({'status':status,'error':error})

@app.route('/upload_photo',methods=['POST','GET'])
def edit_photo():
    status=''
    error=''
    img='https://mdbootstrap.com/img/Photos/Avatars/avatar.jpg'
    cur=mysql.connection.cursor()
    photo=request.files['photo']
    # print(request.files)
    try:
        # print("entered")
        cur.execute(user_details)
        mysql.connection.commit()

        try:
            cur.execute("select * from userDetails where adminId=%s",(session['id'],))
            account=cur.fetchone()
            # print("account ",account)
            if account:
                try:
                    
                    status='success'
                    error='Profile updated successfully'
                    # print("pass 1")
                    name=str(session['name'])
                    name=name.split(' ')[0]
                   
                    # print("photo" , photo)
                    # print("photo filename ", photo.filename)
                    filename=secure_filename(photo.filename)
                    # print("filename",filename)
                    
                    fname='static/images/admin/'+ str(session['id'])+'_'+name+'_'+filename
                    # print("fname",fname)
                    fname1=os.path.join('static/images/admin',str(session['id'])+'_'+name+'_'+filename)
                    # print(fname1)
                    photo.save(fname1)
       
                    # print("filename : ",fname)
                    # print("prev filename",account[7])
                    if account[7]!=None and account[7]!='NULL' and account[7]!=''  and account[7]!='null':
                        os.remove(account[7])  
                    cur.execute("update userDetails set image=%s where adminId=%s",(fname,session['id']))
                    mysql.connection.commit()
                except:
                    status='failed'
                    error='Database error'
        except:
            status='failed'
            error='Database error'
    except:
        status='failed'
        error='Database error'
    return json.dumps({'status':status,'error':error})
            

@app.route('/dashboard',methods=['GET','POST'])
def dashboard():
    if session.get('loggedin'):
        return render_template('dashboard.html')
    else :
        print('not logged in')
        return  redirect(url_for('admin')) 
        # return redirect(url_for('admin'))


@app.route('/add_employee',methods=['POST','GET'])
def add_employee():
    err_msg=''
    status=''
    # print(request.form)
    if session.get('loggedin'):
        if request.method=='POST':
            name=request.form['name']
            empID=request.form['empID']
            email=request.form['email']
            address=request.form['address']
            photo=request.files['image']
            name=name.split(' ')[0]
            filename=secure_filename(photo.filename)
            photo.save(os.path.join('static/images/users',empID+'_'+name+'_'+filename))
            fname='static/images/users/'+empID+'_'+name+'_'+filename
            cur=mysql.connection.cursor()
            try:
                cur.execute("create table if not exists employees (empID int primary key,name varchar(255),email varchar(255),address varchar(255),photo varchar(255),admID int)")
                try:
                    cur.execute("insert into employees (empID,name,email,address,photo,admID) values(%s,%s,%s,%s,%s,%s)",(empID,name,email,address,fname,session['id']))
                    mysql.connection.commit()
                    err_msg='Employee added successfully'
                    status='success'
                    cur.close()
                except(MySQLdb.Error,MySQLdb.Warning):
                    err_msg='Employee already exists'
                    status='fail'
                    cur.close()
            except (MySQLdb.Error,MySQLdb.Warning):
                err_msg='Database error'
                status='fail'     
                cur.close()
        else :
            err_msg='Please fill out the form'
            status='fail'
        error={
            'status':status,
            'error':err_msg
        }
        return json.dumps(error)
         
    else:
        flash('Err!! Please login first')
        return  redirect(url_for('admin'))


@app.route('/list_employees',methods=['GET','POST'])
def employeesList():
    status=''
    employees=[]
   
    
    try:
        cur=mysql.connection.cursor()
        cur.execute("select * from employees where admID=%s",(session['id'],))
        status='success'
        employees=cur.fetchall()
        cur.close()
    except:
        status='fail'
    return json.dumps({'employees':employees,'status':status})



@app.route('/get_attendance',methods=['POST','GET'])
def get_attendance():
    status=''
    error=''
    employees=[]
    tablename=request.form['tablename']
    cur=mysql.connection.cursor()
    try:
        # print("show tables like"+" '"+tablename+"'")
        cur.execute("show tables like"+"'"+tablename+"'")
       
        table=cur.fetchone()
        # print(table)
        if table:
            cur.execute("select * from "+tablename)
            # cur.fetchall()
            # print(cur.fetchall())
            status='success'
            error='Table found'
            cur.execute("select * from employees,%s where employees.empID= %s.empID and employees.admID=%s"%(tablename,tablename,session['id']))
            employees=cur.fetchall()
            cur.close()
        else:
            status='fail'
            error='Table not found'
    except:
        status='fail'
        error='Database error'
    return json.dumps({'status':status,'error':error,'data':employees})



@app.route('/delete_photo',methods=['POST','GET'])
def delete_photo():
    status=''
    error=''
    cur=mysql.connection.cursor()
    try:
        cur.execute(user_details)
        mysql.connection.commit()
        try:
            cur.execute("select * from userDetails where adminId=%s",(session['id'],))
            account=cur.fetchone()
            if account:
                try:
                    status='success'
                    error='Profile updated successfully'
                    print("pass")
                    if account[7]!=None and account[7]!='NULL' and account[7]!=''  and account[7]!='null':
                        # os.remove(account[7])
                        fname1=os.path.join(account[7])
                    # print(fname1)
                        os.remove(fname1)  
                    cur.execute("update userDetails set image=%s where adminId=%s",("NULL",session['id']))
                    mysql.connection.commit()
                except:
                    status='failed'
                    error='Database error'
        except:
            status='failed'
            error='Database error'
    except:
        status='failed'
        error='Database error'
    return json.dumps({'status':status,'error':error})


if __name__== "__main__":
    
    app.run(debug=True,port=5003)

