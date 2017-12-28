moduleRegister.pushModule('mailchimp');
/*
default fields name

<input name=email
<input name=username

*/

var  mailchimpFront =  new Class({

    Extends:x4FrontModule,
    preventJquery: false,
    initialize: function ()
    {     
        this.parent('plugin.extend.mailchimp');
    },
    
     

	subscribe:function(data)
    {
            this.connector.execute({subscribe:data});
            return this.connector.result;
    },

	
    jqueryRun: function ()
    {
        
           if (this.preventJquery) return;                            
		   that=this;
		   
		   $.fn.mailchimpSubscribe = function (options)
            {									
					
					if(!options.onError)options.onError=null;
					if(!options.onSuccess)options.onSuccess=null;
					
					defaultError=function(errorCode,title)
					{
						alert(title);
					};
					
					defaultSuccess=function()
					{
						alert('success');
					};
					
					var defaults = 
					{								 
						onError:options.onError?options.onError:defaultError,
						onSuccess:options.onSuccess?options.onSuccess:defaultSuccess							
					};

					var options = $.extend(defaults, options);
					
					
					
					$(this).submit(function(e)
					{		
						e.preventDefault();	
					    data=xoad.html.exportForm(this); 						
						result=that.subscribe(data);							
						
						
						if(result.subscribe)
						{
							options.onSuccess();	
							
						}else{
							
							options.onError(result.error,result.title);	
						}
						
						
					});
			
			};
		
			if($('#mailchimpSubscribe').length>0)
			{
				
				$('#mailchimpSubscribe').mailchimpSubscribe({onError:function(err,title)
				{
				
						alert(title);
					
				},
				onSuccess:function()
				{	
					$('#email').val('');				
				$(".fancybox.thanks").click();
					  /* $('#mailchimpSubscribe input[name="email"]').prev().hide();
						$('#mailchimpSubscribe input[name="email"]').hide();
						$('#mailchimpSubscribe .submit').val('Спасибо!');*/
				}
				
				});
			}
     
    }
});
	
	
	
	

   


    
