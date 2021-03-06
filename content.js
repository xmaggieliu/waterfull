document.addEventListener('DOMContentLoaded', function () {
    facts = ["Water expands by 9% when it freezes!", 
            "Human bones are 31% water!", 
            "Raindrops are actually not shaped like teardrops! They are shaped more like spheres.", 
            "The saltiest water in the world is located in Don Juan Pond, located in Antarctica!", 
            "A newborn baby is made up of a whopping 78% of water!", 
            "Water is the most common substance on Earth.", 
            "A trillion tons of water are evaporated daily by the sun.", 
            "The water we use now is the same water that existed on Earth millions of years ago!", 
            "A single tomato is comprised of 95% water!", 
            "Waterfalls are created thanks to the process of erosion.", 
            "Plunge, horsetail, and cataract are types of waterfalls.", 
            "A lake is a body of water completely surrounded by land.", 
            "A manmade version of a lake is called a reservoir.", 
            "It is actually possible to convert seawater to freshwater via desalination!"]

    const blocklist = ['https://instagram.com/*', 'https://facebook.com/*', 'https://youtube.com/*', 'https://netflix.ca/*']


    // Display random fact from facts array
    const fact = facts[Math.floor(Math.random() * facts.length)];
    document.getElementById("fun-fact").innerHTML = "Fun fact: " + fact;

    //Notification creation
    // chrome.runtime.onMessage.addListener(data => {
    //     if (data.type === 'notification') {
    //       chrome.notifications.create('', data.options);
    //     }
    //   });

    // Waterfall script ----------------------- SOURCE: https://codepen.io/nrmarston/pen/Jefaz

    var waterfallCanvas = function(c, cw, ch){
                
        var _this = this;
        this.c = c;
        this.ctx = c.getContext('2d');
        this.cw = cw;
        this.ch = ch;			
        
        this.particles = [];
        this.particleRate = 6;
        this.gravity = .15;
                        

        this.init = function(){				
            this.loop();
        };
        
        this.reset = function(){				
            this.ctx.clearRect(0,0,this.cw,this.ch);
            this.particles = [];
        };
                    
        this.rand = function(rMi, rMa){return ~~((Math.random()*(rMa-rMi+1))+rMi);};
        

        this.Particle = function(){
            var newWidth = _this.rand(1,20);
            var newHeight = _this.rand(1, 45);
            this.x = _this.rand(10+(newWidth/2), _this.cw-10-(newWidth/2));
            this.y = -newHeight;
            this.vx = 0;
            this.vy = 0;
            this.width = newWidth;
            this.height = newHeight;
            this.hue = _this.rand(200, 220);
            this.saturation = _this.rand(30, 60);
            this.lightness = _this.rand(30, 60);
        };
        
        this.Particle.prototype.update = function(i){
            this.vx += this.vx; 
            this.vy += _this.gravity;
            this.x += this.vx;
            this.y += this.vy;							
        };
        
        this.Particle.prototype.render = function(){			
            _this.ctx.strokeStyle = 'hsla('+this.hue+', '+this.saturation+'%, '+this.lightness+'%, .05)';
            _this.ctx.beginPath();
            _this.ctx.moveTo(this.x, this.y);
            _this.ctx.lineTo(this.x, this.y + this.height);
            _this.ctx.lineWidth = this.width/2;
            _this.ctx.lineCap = 'round';
            _this.ctx.stroke();
        };
        
        this.Particle.prototype.renderBubble = function(){				
            _this.ctx.fillStyle = 'hsla('+this.hue+', 40%, 40%, 1)';
            _this.ctx.fillStyle = 'hsla('+this.hue+', '+this.saturation+'%, '+this.lightness+'%, .3)';
            _this.ctx.beginPath();
            _this.ctx.arc(this.x+this.width/2, _this.ch-20-_this.rand(0,10), _this.rand(1,8), 0, Math.PI*2, false);
            _this.ctx.fill();
        };
                    
        this.createParticles = function(){
            var i = this.particleRate;
            while(i--){
                this.particles.push(new this.Particle());
            }
        };
        
        this.removeParticles = function(){
            var i = this.particleRate;
            while(i--){
                var p = this.particles[i];
                if(p.y > _this.ch-20-p.height){
                    p.renderBubble();
                    _this.particles.splice(i, 1);
                }	
            }
        };
                        
        this.updateParticles = function(){					
            var i = this.particles.length;						
            while(i--){
                var p = this.particles[i];
                p.update(i);											
            };						
        };
        
        this.renderParticles = function(){
            var i = this.particles.length;						
            while(i--){
                var p = this.particles[i];
                p.render();											
            };					
        };
        
        this.clearCanvas = function(){				
            this.ctx.globalCompositeOperation = 'destination-out';
            this.ctx.fillStyle = 'rgba(255,255,255,.06)';
            this.ctx.fillRect(0,0,this.cw,this.ch);
            this.ctx.globalCompositeOperation = 'lighter';
        };
        
        this.loop = function(){
            var loopIt = function(){					
                requestAnimationFrame(loopIt, _this.c);					
                    _this.clearCanvas();					
                    _this.createParticles();					
                    _this.updateParticles();					
                    _this.renderParticles();	
                    _this.removeParticles();
            };
            loopIt();					
        };

    };

    var isCanvasSupported = function(){
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
    };

    var setupRAF = function(){
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x){
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    };

    if(!window.requestAnimationFrame){
        window.requestAnimationFrame = function(callback, element){
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    };

    if (!window.cancelAnimationFrame){
        window.cancelAnimationFrame = function(id){
            clearTimeout(id);
        };
    };
    };			

    if(isCanvasSupported()){
        var c = document.getElementById('waterfall');
        var cw = c.width = 100;
        var ch = c.height = 400;	
        var waterfall = new waterfallCanvas(c, cw, ch);			  
        setupRAF();
        waterfall.init();
    }

    // ---------------------------------- END OF SRC

    function chromeUpdate() {
        function clearProgress() {
            clearInterval(timer);
            document.querySelectorAll(".progress").forEach(frameElements => {
                frameElements.style.display = "none";            
            });
            // $('#restart').show();
            document.getElementById("restart").display = "block";
            chrome.runtime.sendMessage('', {
                type: 'notification',
                options: {
                title: 'Paradise lost!',
                message: 'You went on one of the blocked websites on Waterfull. Progress has been reset. :(',
                iconUrl: 'icon_80.png',
                type: 'basic'
            }
            });
        }

        chrome.tabs.onUpdated.addListener(clearProgress, blocklist); 
        // chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        //     let url = tabs[0].url;
        //     for (var a = 0; a < blocklist.length; a++) {
        //         if (url == blocklist[a]) {
        //             clearProgress();
        //         }
        //     }
        // });
    }
        

    // Session -------------------------------------------------

    document.getElementById("begin").addEventListener("click", () => {
        inputTime = document.getElementById("input-time").value;
        inputTime = parseInt(inputTime)

        chromeUpdate();

        if (Number.isInteger(inputTime) && inputTime > 0) {
            document.querySelectorAll(".progress").forEach(frameElements => {
                frameElements.style.display = "none";            
            });
            var min = inputTime - 1;
            var sec = 59;
            var frame = 5;
            // $('#session').toggle();
            document.getElementById("session").display = "none";
            // $('#session2').toggle();
            document.getElementById("session2").display = "block";
            // $('#restart').hide();
            document.getElementById("restart").display = "none";
            var timer = setInterval(function() {
                if (sec < 10) {
                    document.getElementById("waterfull-timer").innerHTML = min + ":" + "0" + sec;
                }
                else {
                    document.getElementById("waterfull-timer").innerHTML = min + ":" + sec;
                }
                sec--;
                if (sec >= 0) {
                    document.getElementById("progress-bar").style.height = 100 * (min * 60 + sec) / (inputTime * 60) + '%';
                }
                else if (min > 0) {
                    min--;
                    sec = 59;
                }

                if ((min * 60 + sec) * 6 / frame == inputTime * 60) {
                    frameId = "progress" + (frame+1);
                    document.getElementById(frameId).style.display = "block";
                    frame--;
                }
                
                if (sec < 0 && min <= 0) {
                    document.getElementById('progress1').style.display = "block";
                    // $('#restart').show();
                    document.getElementById("restart").display = "block";
                    clearInterval(timer);
                }
            }, 1000, min, sec, frame)
        }    
        else {
            // $('#p-error').fadeIn('fast').delay(1500).fadeOut('fast');
            document.getElementById("p-error").display = "block";
            setTimeout(function () {
                document.getElementById("p-error").display = "none";
            }, 1500)
        }
    })



    document.getElementById("restart").addEventListener("click", () => {
        // $('#session').toggle();
        document.getElementById("session").display = "block";
        document.getElementById("session2").display = "none";
        // $('#session2').toggle();
    })
})