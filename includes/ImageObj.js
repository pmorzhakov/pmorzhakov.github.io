function ImageObj (src,x,y) {
  this.img=new Image();

  this.src=src;
  this.x = x;
  this.y = y;
  this.xpos = 0;
  this.ypos = 0;
  this.name="*";
  this.value=-1;
this.rendered=false;
	this.id=0;
  this.vy = 0;
this.width=0;
this.height=0;
  this.visible = true;
  

}
ImageObj.prototype.draw = function (context) {

	var self=this;
	this.img.onload=function(){
		if(self.width==0){
			self.width=this.width;
			self.height=this.height;
		}
			else if(self.height==0){
			self.width=this.width;
			self.height=this.height;
		}
	 context.drawImage(this,self.x,self.y,self.width,self.height);
	}
	if(this.img.width>0){
		context.drawImage(this.img,this.x,this.y,this.width,this.height);
		
	}
	else
	 this.img.src=this.src;

	
};
