(function(){

    var scrollY = function(){ //get the current scroll position according to the window top
        var supportPageOffset = window.pageXOffset !== undefined;
        var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
        return  supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
    }

    var makeSticky =  function(element){
        var rec = element.getBoundingClientRect()
        var top = rec.top + scrollY() //position of my element according to the window top
        var offset = element.getAttribute('data-offset') ? parseInt(element.getAttribute('data-offset'), 10) : 0 
        var constraint = element.getAttribute('data-constraint') ? document.querySelector(element.getAttribute('data-constraint')) : document.body
        var constraintRect = constraint.getBoundingClientRect()
        var constraintBottom = constraintRect.top + scrollY() + constraintRect.height - offset - rec.height
        
        //Our text element dispears when the menu become fixed. It goes to under the logo element
        //we will add a fake element to simulate the presence of the menu 
        var fake = document.createElement('div')
        fake.style.width = rec.width + "px"
        fake.style.height = rec.height + "px"


        // Fonctions
        var onScroll = function(){
            //see on scroll if my element has the fixed class
            var hasFixedClass = element.classList.contains('fixed')

            if(scrollY() > constraintBottom && element.style.position != 'absolute'){
            //  element.classList.remove('fixed')
                element.style.position = 'absolute'
                element.style.bottom = '0'
                element.style.top = 'auto'
            
            }else if( scrollY() > top - offset  &&  scrollY() < constraintBottom && element.style.position != 'fixed'){ //will add fixed only if doesnt have it - limit the add 
                element.classList.add('fixed')
                element.style.top = offset + "px"
                element.style.width = rec.width + "px"
                element.style.bottom = 'auto'
                element.style.position = 'fixed'
                element.parentNode.insertBefore(fake, element)
            }else if(scrollY() < top - offset && element.style.position != 'static'){ //will remove fixed only if have it - limit the remove
                element.classList.remove('fixed')
                element.style.position = 'static'
                if(element.parentNode.contains(fake)){
                    element.parentNode.removeChild(fake)
                }else{}
                
            }
        }

        var onResize = function(){
            //cancel everything
            element.style.width = "auto"
            element.classList.remove('fixed')
            element.style.display = "static"
            fake.style.display = "none"


            top = rec.top + scrollY() //position of my element according to the window top
            constraintRect = constraint.getBoundingClientRect()
            constraintBottom = constraintRect.top + scrollY() + constraintRect.height - offset - rec.height

            //recalculate 
            rec = element.getBoundingClientRect()
            top = rec.top + scrollY()
            fake.style.width = rec.width + "px"
            fake.style.height = rec.height + "px"
            fake.style.display = "block"
            onScroll()

        }


        // Listeners
        window.addEventListener('scroll', onScroll)

        window.addEventListener('resize', onResize)
    }

  
    var elements = document.querySelectorAll('[data-sticky]')

    for(let i = 0; i < elements.length; i++){
        makeSticky(elements[i])   
    }

})()