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
    
      <strong>Success </strong> ${message} Redirecting to login page in 5 seconds
    <button
      type="button"
      class="btn-close"
      data-mdb-dismiss="alert"
      aria-label="Close"
    ></button>
  </div>`;
  }
  
  $(document).on('submit','#signup-form',function(e){
       e.preventDefault();
      var form_data = new FormData();
      console.log(form_data)
      form_data.append('name',$('#name').val());
      form_data.append('email',$('#email').val());
      form_data.append('password',$('#password').val());
      form_data.append('confirm_password',$('#confirmPassword').val());
      form_data.append('username',$('#username').val());
  
    
      $.ajax({
        type: "POST",
        url: "/signup",
        data: form_data,
        processData: false,
        contentType: false,
    
        success: function (response) {
            response=JSON.parse(response);
            console.log(response);
            $('#signup-form').trigger('reset');
            form_data=new FormData();
            if(response.status=='success'){
               $('#error').html(success_alert('Account created successfully')); 
                setTimeout(function(){
                  window.location.href="/admin";
                },5000);
              // window.location.href="/dashboard";
            }
            else{
               $('#error').html(error_alert(response.error));
            }
            
        }
      });
    
  });