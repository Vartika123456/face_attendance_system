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
  $(document).on('submit','#login-form',function(e){
       e.preventDefault();
      var form_data = new FormData();
      form_data.append('username',$('#username').val());
      form_data.append('password',$('#password').val());
    
      $.ajax({
        type: "POST",
        url: "/login",
        data: form_data,
        processData: false,
        contentType: false,
    
        success: function (response) {
            response=JSON.parse(response);
            console.log(response);
           $('#username').val("");
            $('#password').val("");
            form_data=new FormData();
            if(response.status=='success'){
               $('#error').html(success_alert('Login Successful')); 
                setTimeout(function(){
                  window.location.href="/dashboard";
                },2000);
              // window.location.href="/dashboard";
            }
            else{
               $('#error').html(error_alert(response.error));
            }
            
        }
      });
    
  });