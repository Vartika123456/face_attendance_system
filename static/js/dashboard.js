function get_row(data){
  return `
  <tr>
  <td>
    <p>${data[0]}</p>
  </td>
  <td>
    <div class="d-flex align-items-center">
      <img
          src="${data[4]}"
          alt=""
          style="width: 45px; height: 45px"
          class="rounded-circle"
          />
      <div class="ms-3">
        <p class="fw-bold mb-1">${data[1]}</p>
        <p class="text-muted mb-0">${data[2]}</p>
      </div>
    </div>
  </td>
 
  <td> <p> ${data[3]}</p></td>
  <td>
    <button type="button" id="${data[0]}" class="btn btn-link btn-sm btn-rounded">
      Edit
    </button>
  </td>
</tr>
  `;
}
function get_time(date){
  var date = new Date(date);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}
function get_attendance_row(data){
  return `
  <tr>
  <td>
    <p>${data[0]}</p>
  </td>
  <td>
    <div class="d-flex align-items-center">
      <img
          src="${data[4]}"
          alt=""
          style="width: 45px; height: 45px"
          class="rounded-circle"
          />
      <div class="ms-3">
        <p class="fw-bold mb-1">${data[1]}</p>
        <p class="text-muted mb-0">${data[2]}</p>
      </div>
    </div>
  </td>
 
  <td> <p> ${data[3]}</p></td>
  <td>
    <p class="text-muted mb-0">${get_time(data[7])}</p>
  </td>
</tr>
  `;
}

function edit_profile(data){
  return `<div class="container-fluid">
  <section class="section">
    <div class="row">
      <!-- First column -->
      <div class="col-lg-4 mb-4">
        <!-- Card -->
        <div class="card card-cascade narrower">
          <div class="card-header">
            <h5>Edit Photo  </h5>
          </div>
          <div class="card-body card-body-cascade text-center">
            <img class="sh rounded-circle z-depth-2" alt="100x100"
              src="${data.img}" data-holder-rendered="true">
            <p class="text-muted"><small>Profile photo will be changed automatically</small></p>
  
              <input class="form-control " type="file" name="photo" id="photo" accept="image/*">
              <div class="flex-row btn-cnt mt-3">
                <button  class="btn btn-primary" id="upload-photo">Upload New Photo</button>
                <button class="btn btn-danger" id="del-photo">Delete photo</button>
              </div>
        
          </div>
        </div>
      </div>
      <div class="col-lg-8 mb-4">
        <div class="card ">
          <div class="card-header">
            <h5>Personal Information</h5>
          </div>
          <div class="card-body card-body-cascade text-center">
          
              <!--  edit profile form -->
              <div class="input-group mb-3">
                <span class="input-group-text" id="inputGroup-sizing-default">Name</span>
                <input type="text" name="name" class="form-control" aria-label="Sizing example input"
                 value="${data.name}" id="name" aria-describedby="inputGroup-sizing-default" />
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text" id="inputGroup-sizing-default">Email</span>
                <input type="text" id="email" name="email" value="${data.email}" class="form-control" aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default" />
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text" id="inputGroup-sizing-default">Phone</span>
                <input type="text" id="phone" name="phone" value="${data.phone}" class="form-control" aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default" />
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text" id="inputGroup-sizing-default">Address</span>
                <input type="text" id="address" name="address" value="${data.address}" class="form-control" aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default" />
              </div>
              <div class="form-group">
                <button class="btn btn-primary" id="update-personal-info" >Update Details</button>
              </div>
          
          </div>
        </div>
        <div class="card mt-3">
          <div class="card-header">
            <h5>Change Password</h5>
          </div>
          <div class="card-body text-center">
          
              <div class="input-group mb-3">
                <span class="input-group-text" id="inputGroup-sizing-default">Old Password</span>
                <input type="password" id="oldPassword" class="form-control" aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default" />
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text" id="inputGroup-sizing-default">New Password</span>
                <input type="password" id="newPassword" class="form-control" aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default" />
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text" id="inputGroup-sizing-default">Confirm Password</span>
                <input type="password" id="newPasswordConfirm" class="form-control"
                  aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
              </div>
              <div class="form-group">
                <button class="btn btn-primary"  id="changePassword">Change Password</button>
              </div>
            
          </div>
        </div>
      </div>
    </div>
  </section>
</div>`;
}
function success_alert(message){
  return `<div class="alert alert-success alert-dismissible fade show" role="alert" data-mdb-color="warning">
  <strong>Success </strong> ${message}
  <button
    type="button"
    class="btn-close"
    data-mdb-dismiss="alert"
    aria-label="Close"
  ></button>
</div>`;
}
function error_alert(error){
  return `    <div class="alert alert-danger alert-dismissible fade show" role="alert" data-mdb-color="warning">
  <strong>Error!! </strong> ${error}
  <button
    type="button"
    class="btn-close"
    data-mdb-dismiss="alert"
    aria-label="Close"
  ></button>
</div>`;
}
function add_emp_form(){
  return `<div class="card">
  <div class="card-body">
  <div class="container-fluid h-custom" >
  <div class="row d-flex justify-content-center align-items-center h-100">    
        <div class="col-md-9 col-lg-6 col-xl-5">
            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                      class="img-fluid" alt="Sample image">
          </div>
        <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <form method="POST"  id="add_emp_form" enctype="multipart/form-data">
  
                <div class="form-outline">
                    <input type="text" id="name" class="form-control mb-3" name="name"/>
                    <label class="form-label" for="name">Name</label>
                </div>
                <div class="form-outline">
                    <input type="text" id="email" class="form-control mb-3" name="email"/>
                    <label class="form-label" for="email">Email</label>
                </div>
                <div class="form-outline">
                    <input type="text" id="empID" class="form-control mb-3" name="empID"/>
                    <label class="form-label" for="empID">Employee ID</label>
                </div>
              
                <div class="form-outline">
                    <input type="text" id="address" class="form-control mb-3" name="address"/>
                    <label class="form-label" for="address">Address</label>
                </div>
          
                <div class="form-outline">
                    <input type="file" id="image" accept="image/*" class="form-control mb-3" name="image"/>
                   
                </div>
              
                <div class="form-outline">
                    <button type="submit" class="btn btn-primary" id="addEmployee">Add Employee</button>
                </div>
  
          </form>
          </div>
        </div>
        </div></div> </div>`;
}

$(document).on('submit','#add_emp_form',function(e){
     e.preventDefault();
    var form_data = new FormData();
    form_data.append('name',$('#name').val());
    form_data.append('email',$('#email').val());
    form_data.append('empID',$('#empID').val());
    form_data.append('address',$('#address').val());
    form_data.append('image',$('#image')[0].files[0]);
    $.ajax({
      type: "POST",
      url: "/add_employee",
      data: form_data,
      processData: false,
      contentType: false,
  
      success: function (response) {
          response=JSON.parse(response);
          console.log(response);
          $('#name').val("");
          $('#email').val("");
          $('#empID').val("");
          $('#address').val("");
          $('#image').val("");
          form_data=new FormData();
        if(response.status == 'success'){
           $('#main-data').html(success_alert(response.error)+$('#main-data').html());
        }else{
           $('#main-data').html(error_alert(response.error)+$('#main-data').html());
        }
      }
    });
  
});

// function getdashboard(){
//   return `
//   <div style="height:90%;"></div>
//   `
// }


function get_profile(data){
   return `
   <div class="container-fluid">
   <section class="section">
     <div class="row">
       <!-- First column -->
       <div class="col-lg-4 mb-4">
         <!-- Card -->
        
          
           <div class="card-body card-body-cascade text-center">
             <img class="sh rounded-circle z-depth-2" alt="100x100"
               src="${data.img}" data-holder-rendered="true">
         </div>
       </div>
       <div class="col-lg-8 mb-4 mt-5">
         <div class="card ">
           <div class="card-header">
             <h5>Personal Information</h5>
           </div>
           <div class="card-body card-body-cascade">
                 <!-- account details -->
                 <div class="row mt-2 mb-2">
                  <span>  <strong> Name : </strong> ${data.name} </span>
                     
                 </div>
                 <div class="row mt-2 mb-2">
                <span> <strong> Username : </strong> ${data.username} </span>
                 
                 </div>
                 <div class="row mt-2 mb-2">
                 <span> <strong> Email : </strong> ${data.email}  </span>
                 </div>
                 <div class="row mt-2 mb-2">
                  <span> <strong> Phone : </strong> ${data.phone}  </span>
                 </div>
                 <div class="row mt-2 mb-2">
                  <span> <strong>Address : </strong> ${data.address} </span>
                 </div>
           </div>
         </div>
       </div>
       </div>
     </div>
   </section>
 </div>`;
}
function getdata(element,name="") {

       while(1){         
          let curr_active=document.getElementsByClassName('active');
          if(curr_active.length>0){
            curr_active[0].classList.remove('active');
          }else{
            break;
          }
       }
       
  
    element.classList.add('active');

    let heading=document.getElementById('main-heading');
    let data=document.getElementById('main-data');
    let dummydata={
      name:'Dummy Name',
      username:'Dummy Username',
      email:'dummy@dummy.com',
      phone:'1234567890',
      address:'Dummy Address',
      img:'https://mdbootstrap.com/img/Photos/Avatars/avatar.jpg'

    }
  // console.log(curr_active);
   if(element.id=='main-dashboard'){
       
          // curr_active.classList.remove('active');
          
       heading.innerHTML=`Welcome ${name}`;
       data.innerHTML="This is Main Dashboard";
     
  element.ClassList.add('active');

   }else if(element.id=='new-employee'){
          heading.innerHTML="Add new Employee/ Student";
          data.innerHTML=add_emp_form();

   }else if(element.id=='employees'){
          heading.innerHTML="Employee List";
          let data_employee=`<div class="card"><div class="card-body"><table class="table align-middle mb-0 bg-white">
          <thead class="bg-light">
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Address</th>            
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>`;
          $.ajax({
            type: "POST",
            url: "/list_employees",
            processData: false,
            contentType: false,
            success: function (response) {
                response=JSON.parse(response);
                console.log(response);
                if(response.status=='success'){
                    response.employees.forEach(element => {
                      data_employee+=get_row(element);
                    })
                    data_employee+='</tbody>';
                    data_employee+='</table> </div> </div>';
                     data.innerHTML=data_employee;
                }else{
                    data.innerHTML=error_alert(response.error);
                }
            }
          });
          
                  // console.log(xhr.responseText);
                  
                  
                     
               
          // data.innerHTML=data_employee;

   } 
     else if(element.id=='edit-profile'){
          heading.innerHTML="Edit Profile";
          $.ajax({
            type: "POST",
            url: "/profile",
            processData: false,
            contentType: false,
        
            success: function (response) {
                response=JSON.parse(response);
                console.log(response);
                
              if(response.status == 'success'){
                data.innerHTML=edit_profile(response.data);
              }else{
                 data.innerHTML=error_alert("Error fetching profile");
              }
            }
          });
          // data.innerHTML=edit_profile(dummydata);


   }
   else if(element.id=='attendance-stats'){
          heading.innerHTML="Attendance Stats";
          data.innerHTML=`
          <div class="card text-center" >
            <div class="card-body">
                  <div class="date-container">
                  <label for="datepicker">Pick a Date
                    <input type="date" id="datepicker" autocomplete="off">
                  </label>	
                  <button class="btn btn-primary" ><a onclick="getAttendance()">Get Attendance </a></button>
                </div>
               </div>
          </div>`;

   }else if(element.id=='profile'){
          heading.innerHTML="Profile";
          $.ajax({
            type: "POST",
            url: "/profile",
            processData: false,
            contentType: false,
        
            success: function (response) {
                response=JSON.parse(response);
                console.log(response);
                
              if(response.status == 'success'){
                data.innerHTML=get_profile(response.data);
              }else{
                 data.innerHTML=error_alert("Error fetching profile");
              }
            }
          });
          
          data.innerHTML=get_profile(dummydata);
   }
}

$(document).on('click','#update-personal-info',function(e){
  var form_data = new FormData();
  form_data.append('name',$('#name').val());
  form_data.append('email',$('#email').val());
  form_data.append('phone',$('#phone').val());
  form_data.append('address',$('#address').val());
  
  $.ajax({
    type: "POST",
    url: "/edit_personal_info",
    data: form_data,
    processData: false,
    contentType: false,
 
    success: function (response) {
        response=JSON.parse(response);
        console.log(response);
            
        form_data=new FormData();
      if(response.status == 'success'){
         $('#main-data').html(success_alert(response.error)+edit_profile(response.data));
      }else{
         $('#main-data').html(error_alert(response.error)+edit_profile(response.data));
      }
    }
  });
});


$(document).on('click','#changePassword',function(e){
  console.log('change password');
  var form_data = new FormData();
  form_data.append('oldPassword',$('#oldPassword').val());
  form_data.append('password',$('#newPassword').val());
  form_data.append('confirmPassword',$('#newPasswordConfirm').val());
  
  $.ajax({
    type: "POST",
    url: "/change_password",
    data: form_data,
    processData: false,
    contentType: false,
 
    success: function (response) {
        response=JSON.parse(response);
        console.log(response);
            
        form_data=new FormData();
        $('#oldPassword').val('');
        $('#newPassword').val('');
        $('#newPasswordConfirm').val('');
      if(response.status == 'success'){
         $('#main-data').html(success_alert(response.error)+$('#main-data').html());
      }else{
         $('#main-data').html(error_alert(response.error)+$('#main-data').html());
      }
    }
  });
});

$(document).on('click','#upload-photo',function(e){
  e.preventDefault();
  var form_data = new FormData();
  form_data.append('photo',$('#photo')[0].files[0]);
  console.log(form_data['photo']);
  $.ajax({
    type: "POST",
    url: "/upload_photo",
    data: form_data,
    processData: false,
    contentType: false,
    success: function (response) {

        response=JSON.parse(response);
        console.log(response);
        if(response.status == 'success'){
          $('#main-data').html(success_alert(response.error)+$('#main-data').html());
        }else{
          $('#main-data').html(error_alert(response.error)+$('#main-data').html());
        }
       }

    });
});
$(document).on('click','#del-photo',function(e){
  e.preventDefault();
  $.ajax({
    type: "POST",
    url: "/delete_photo",
    success: function (response) {
        response=JSON.parse(response);
        console.log(response);
        if(response.status == 'success'){
          $('#main-data').html(success_alert(response.error)+$('#main-data').html());
        }else{
          $('#main-data').html(error_alert(response.error)+$('#main-data').html());
        }
       }
  });
});

$(document).ready(function(){
  $.ajax({
    type: "POST",
    url: "/profile",
    processData: false,
    contentType: false,

    success: function (response) {
        response=JSON.parse(response);
        console.log(response);
        
      if(response.status == 'success'){
             $('#profile_pic').attr('src',response.data.img);
      }else{
         data.innerHTML=error_alert("Error fetching profile");
      }
    }
  });
});

function get_attendance(data,date){
   var innerhtml=`
     <div class="card mt-3">
     <div class="card-header text-center">
                ${date}
     </div>
      <div class="card-body">
    <table class="table align-middle mb-0 bg-white">
      <thead class="bg-light">
        <tr>
          <th>Employee ID</th>
          <th>Name</th>
          <th>Address</th>            
          <th>In Time</th>
        </tr>
      </thead>
      <tbody>
      `;
      data.forEach(element => {
        innerhtml+=get_attendance_row(element);
      });
      innerhtml+=`
      </tbody>
    </table>
    </div>
  </div>`;


  return innerhtml;
}

function getAttendance(){
  console.log("clicked on get attendance")
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
  var date=$('#datepicker').val();
  let vals=date.split('-');
  let month=monthNames[parseInt(vals[1])-1];
  let year=vals[0];
  let day=vals[2];
  let tablename=month+year+day;
  let date_table=day+"/" + monthNames[parseInt(vals[1])-1] + "/" + year;
  form_data = new FormData();
  form_data.append('tablename',tablename);
  $.ajax({
    type: "POST",
    url: "/get_attendance",
    data: form_data,
    processData: false,
    contentType: false,
    success: function (response) {
        response=JSON.parse(response);
        console.log(response);
        if(response.status == 'success'){
          $('#main-data').html( $('#main-data').html() +success_alert(response.error)+get_attendance(response.data,date_table));
        }else{
          $('#main-data').html( $('#main-data').html()+error_alert(response.error));
        }
      }
  })
}