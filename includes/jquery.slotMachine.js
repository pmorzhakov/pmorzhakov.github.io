// JavaScript Document
// Utility
if (typeof Object.create !== 'function') {
	Object.create = function(obj) {
		function F() {};
		F.prototype = obj;
		return new F();
	};
};
(function($, window, document, undefined) {
	var quantity,




	imageObj = null,
		curr = -1,
			
	cnvsHolder = $(	"<div class = 'canvasHolder'> </div>"),
	dummyCanvas= $(" <canvas width='00' height='00'>Your Browser Does not support this feature. Please update to a latest browser</canvas>");
	canvasTemplate = $(" <canvas width='400' height='400'>Your Browser Does not support this feature. Please update to a latest browser</canvas>");
	

	var SlotMachine = {
			init: function(options, elem) {

				var self = this;
				self.elem = elem;
				self.$elem = $(elem);
				self.options = $.extend({}, $.fn.slotMachine.options, options);
				//console.log(self.options.slotData)
				//console.log(self.options.slotControls);

				self.cnvs = canvasTemplate.clone();
				self.dummy=dummyCanvas.clone();
				self.cnvsHolder = cnvsHolder.clone();

				self.cnvsHolder.append(self.cnvs);
				//console.log(self.cnvsHolder)
				self.$elem.html(self.cnvsHolder);
				self.$elem.append(self.options.slotControls.clone());


				//console.log("APPEND:");
				//console.log(self.cnvs)

				self.ctx = self.cnvs[0].getContext("2d");
				self.dummyctx=self.dummy[0].getContext("2d");
				self.cH = self.ctx.canvas.height;
				self.cY = 0;

				self.cW = self.ctx.canvas.width;
				self.cX = self.options.slotData.extraWidth;
				self.oVy = self.options.slotData.imageHeight;
				self.totalColumns = self.options.slotData.images.length;
				self.creditsBet = 0;

				self.imageObjs = new Array();
				self.changeArr = new Array(),
				self.currentRow = -1;
				self.req = -1,
				self.finElArr = new Array(),
				self.spinTimesCurrArr = new Array(),
				self.markSpin = new Array(),
				self.spinTimesTotalArr = new Array(),
				self.currArr = new Array(),

				self.imgsLoaded = 0,
				self.totalLines = 0,
				self.vy = new Array(),
				self.anim = true,
				self.animStart = false,
				self.finElStr = "",
				self.payoutArr = new Array(),
				self.payout = -1,
				self.finElArrMapped = new Array(),
				self.betClicked = false,
				self.payoutTotal = 0,
				self.creditsSound = false,
				self.creditTimer = 1,
				self.textOffset = 0,
				self.mute=false;

				self.ctx.canvas.height = self.cH = self.options.slotData.imageHeight * 3;

				self.ctx.canvas.width = self.options.slotData.imageWidth * (self.totalColumns) + self.options.slotData.extraWidth * 2;
				tempTotCredits = self.options.slotData.totalCredits;
				if (self.options.slotData.payBy == 1) {
					self.options.slotData.creditsMax = self.options.slotData.lines.length;
				}
				if (self.options.slotData.shuffleSlots) {
					for (var i = 0; i < self.options.slotData.images.length; i++) {
						//		self.options.slotData.images[i] = self.options.slotData.images[1]
						//	console.log(self.options.slotData.images[i])
						self.options.slotData.images[i] = self.shuffleArray(self.options.slotData.images[i]);
					}
				}

				for (var i = 0; i < self.totalColumns; i++) {
					self.imgsLoaded = 0;
					self.cX = i * self.options.slotData.imageWidth + self.options.slotData.extraWidth;
					self.cY = 0;
					var tempArr = new Array();
					for (; self.imgsLoaded < self.options.slotData.images[i].length; self.imgsLoaded++) {
						if (typeof(self.options.slotData.images[i][self.imgsLoaded]) === 'string') {
							for (var j = 0; j < self.options.slotData.imageValues.length; j++) {
								if (self.options.slotData.images[i][self.imgsLoaded] == self.options.slotData.imageValues[j].name) {
									self.options.slotData.images[i][self.imgsLoaded] = self.options.slotData.imageValues[j].value;
									break;
								}
							}
						}
						for (j = 0; j < self.options.slotData.imageValues.length; j++) {
							if (self.options.slotData.images[i][self.imgsLoaded] == self.options.slotData.imageValues[j].value) {
								imageObj = new ImageObj(self.options.slotData.imageValues[j].path, 0, self.cY);
								imageObj.name = self.options.slotData.imageValues[j].name;
								imageObj.value = self.options.slotData.imageValues[j].value;
							}
						}
						//console.log(self.cY);
						self.cY += self.options.slotData.imageHeight;
						self.cH += self.cY;
						imageObj.id = self.imgsLoaded;
						imageObj.x = self.cX;
						imageObj.width = self.options.slotData.imageWidth;
						imageObj.height = self.options.slotData.imageHeight;
						imageObj.draw(self.ctx);
						tempArr.push(imageObj);

					}
					self.changeArr.push(self.imgsLoaded - 1)
					self.imageObjs[i] = tempArr;
				}

				self.cY -= self.options.slotData.imageHeight / 2;
				self.ctx.fillStyle = "rgba(0, 0, 0, 1)";
				//console.log("STYLEEEE:"+self.options.slotData.fontStyle)
				self.ctx.font = "digital-7regular bold 12px";
				//	self.ctx.fillRect(0, 128, self.ctx.canvas.width, 256);
				curr = self.imageObjs.length - 1
				matchedRows = 0;

				self.creditsTotal = self.$elem.find(".creditsTotal")
				self.creditsTotal.val(self.options.slotData.totalCredits);
				self.creditsBetField = self.$elem.find(".creditsBet");
				self.creditsWon = self.$elem.find(".creditsWon");
				self.creditsWon.val(0);
				self.creditsBetField.val(0);
				self.betMax = self.$elem.find(".betMax");
				self.betOne = self.$elem.find(".betOne");
				self.spinBtn = self.$elem.find(".spinBtn");
				self.payoutBtn = self.$elem.find(".payTable");
				self.toggleMute=self.$elem.find(".muteToggle");
				self.betMax.bind("click", $.proxy(self.onBetMax, self));
				self.betOne.bind("click", $.proxy(self.onBetOne, self));
				self.payoutTable = new Array();
				for (var i = 0; i < self.options.slotData.payTableImages.length; i++){
				self.payoutTable[i] = new ImageObj(self.options.slotData.payTableImages[i], 0, 0);
				self.payoutTable[i].draw(self.dummyctx);
				}
				//console.log("***************************")
				//console.log(self.payoutTable)
				self.payoutBtn.bind("click", $.proxy(self.showPayTable, self));
				self.toggleMute.bind("click",$.proxy(self.toggleSound,self));
				self.currentPayImage = 0;

				self.showPayout = true;
			},
			toggleSound:function(e){
				e.preventDefault();
				
				var self=this;
				//console.log(self.toggleMute.data())
				if(self.mute){
					self.toggleMute.html("<img src="+self.toggleMute.data("soundon")+">")
					self.options.slotData.coinInsertSound.setVolume(100);
		self.options.slotData.spinSound.setVolume(100);
		self.options.slotData.winSound.setVolume(100);
		self.options.slotData.countSound.setVolume(100);
					
				}else{
					self.toggleMute.html("<img src="+self.toggleMute.data('soundoff')+">")
					self.options.slotData.coinInsertSound.setVolume(0);
		self.options.slotData.spinSound.setVolume(0);
		self.options.slotData.winSound.setVolume(0);
		self.options.slotData.countSound.setVolume(0);
				}
				self.mute=!self.mute;
			},
			drawFrame: function() {
				var self = this;
				//console.log(self.cnvs);
				self.req = window.requestAnimationFrame($.proxy(self.drawFrame, self), self.ctx.canvas);
				self.ctx.clearRect(0, 0, self.ctx.canvas.width, self.ctx.canvas.height);
				for (i = 0; i < self.totalColumns; i++) {
					self.currentRow = i;
					self.currArr = self.imageObjs[i];
					if (self.spinTimesCurrArr[i] != self.spinTimesTotalArr[i]) {
						for (var j = 0; j < self.currArr.length; j++) {
							self.move(self.currArr[j]);
						}
						for (var j = 0; j < self.currArr.length; j++) {
							if (self.currArr[j].y > -self.options.slotData.imageHeight && self.currArr[j].y < self.ctx.canvas.height + self.options.slotData.imageHeight) {

								self.draw(self.currArr[j]);
							}
							self.currArr[j].rendered = false;

						}

						//				console.log(self.finElArr)
						//					console.log(self.currArr)
						if (self.currArr[self.finElArr[i]].y < self.options.slotData.imageHeight + self.vy[i] && self.currArr[self.finElArr[i]].y >= self.options.slotData.imageHeight && self.markSpin[i]) {
							self.spinTimesCurrArr[i]++;
							self.markSpin[i] = false;
							//						if (i == 0) console.log(self.spinTimesCurrArr[i] + "@@@@@" + i);
							//	console.log(self.options.slotData.images[i][self.finElArr[i]])

							if (self.spinTimesCurrArr[i] == self.spinTimesTotalArr[i]) {

								matchedRows++;
								if (self.imageObjs[i][self.finElArr[i]].y != self.options.slotData.imageHeight) {

									self.vy[i] = self.options.slotData.imageHeight - self.imageObjs[i][self.finElArr[i]].y;
									for (var j = 0; j < self.imageObjs[i].length; j++) {
										if (self.imageObjs[i][j].y + self.vy[i] <= -self.options.slotData.imageHeight) {
											if (!self.imageObjs[i][self.changeArr[i]].rendered) {
												self.imageObjs[i][j].y = self.currArr[self.changeArr[self.currentRow]].y + self.options.slotData.imageHeight - self.vy[self.currentRow];
											} else {
												self.imageObjs[i][j].y = self.currArr[self.changeArr[self.currentRow]].y + self.options.slotData.imageHeight;
											}

											self.changeArr[self.currentRow] = self.imageObjs[i][j].id

										}
										else {
											self.imageObjs[i][j].y += self.vy[i];
										}
										self.imageObjs[i][j].rendered = true;
									}
								}
							}
							self.vy[i] = self.vy[i];
						}

					} else if (matchedRows == self.totalColumns) {
						self.ctx.clearRect(0, 0, self.ctx.canvas.width, self.ctx.canvas.height);
						for (i = 0; i < self.totalColumns; i++) {

							for (var j = 0; j < self.imageObjs[i].length; j++) {

								self.draw(self.imageObjs[i][j]);
							}
						}

						//	self.currArr.forEach(draw);
						self.adjustEnd();
						self.calculatePayouts();
						break;
					}
					else {
						self.currArr.forEach($.proxy(self.draw, self));
					}
				}
				//			self.ctx.fillRect(0, self.options.slotData.imageHeight, self.ctx.canvas.width, self.options.slotData.imageHeight);



			},
			move: function(imageObj) {
				var self = this;

				if (imageObj.y <= -self.options.slotData.imageHeight) {
					//	console.log("REDDDD:" + self.imageObjs[curr].rendered)
					if (!self.currArr[self.changeArr[self.currentRow]].rendered) {
						imageObj.y = self.currArr[self.changeArr[self.currentRow]].y + self.options.slotData.imageHeight - self.vy[self.currentRow];
					} else {
						imageObj.y = self.currArr[self.changeArr[self.currentRow]].y + self.options.slotData.imageHeight;
					}

					self.changeArr[self.currentRow] = imageObj.id
					self.markSpin[self.currentRow] = true;
					if (self.currentRow == 1) {

					}
					/* for (var i = 0; i < self.imageObjs.length; i++)
					 console.log(self.imageObjs[i].y)
					 console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")*/

				} else {
					imageObj.y -= self.vy[self.currentRow];
				}
				/*	if (imageObj.id == self.finElArr[self.currentRow] && self.currentRow == 0) {
				 console.log("++++++++++++++++" + imageObj.y)
				 if (imageObj.y == self.options.slotData.imageHeight) console.log(imageObj.y + "****************************" + self.currentRow)
				 }*/
				imageObj.rendered = true;

				//	else if (imageObj.y > 64 && imageObj.y < self.options.slotData.imageHeight) curr = imageObj;

			},
			draw: function(imageObj) {
				var self = this;
				imageObj.draw(self.ctx);
			},
			calculatePayouts: function() {
				var self = this;

				self.payoutTotal = 0
				self.textOffset = 0;
				for (var i = 0; i < self.totalLines; i++) {
					self.payoutTotal += parseInt(self.payoutArr[i], 10);
					if (self.payoutArr[i] > 0) {
						self.ctx.save();
						self.ctx.beginPath();
						if (i > self.totalColumns - 1) {


							self.ctx.fillStyle = self.ctx.strokeStyle = self.options.slotData.lineColors[i]
							// utils.colorToRGB('#' + Math.floor(Math.random() * 16777215).toString(16), 0.7);
							self.ctx.lineWidth = 5;
						}
						else {
							self.ctx.fillStyle = self.ctx.strokeStyle = self.options.slotData.lineColors[i]
							// utils.colorToRGB('#' + Math.floor(Math.random() * 16777215).toString(16), 1);
							self.ctx.lineWidth = 10;
						}



						self.textOffset += 30

						self.drawLine(self.options.slotData.lines[i], "")
						self.ctx.restore();
					}



				}
				self.textOffset += 30
				//self.ctx.fillText("Total Winnings:" + self.payoutTotal, 0, self.textOffset)
				if (self.payoutTotal > 0) {
					self.options.slotData.winSound.play();
					self.creditsWon.val(self.payoutTotal);
					self.creditTimer = Math.ceil(self.payoutTotal / 100)
					setTimeout($.proxy(self.animateCredits, self), 2000);
					self.creditsSound = true;

				}
				else {

					self.creditsWon.val(0);
					self.animStart = false;
					self.bindAll();
				}
				//self.creditsBet = 0;
				//	self.creditsBetField.val(self.creditsBet);
				//console.log(self.options.slotData);







				// Selecting the input element and get its value 
            	var _name = document.getElementById("fname").value;
            	var _company = document.getElementById("fcompany").value;
            	var _reward = self.payoutTotal;
            
            	//var _url = "https://docs.google.com/forms/d/e/1FAIpQLSdBhcNkVqfyxnobmVvOHmtrdJKAwwrhW8PNO7vcFuVb9oVsnA/formResponse?usp=pp_url&entry.200784527=" + _name + "&entry.235462744=" + _company + "&entry.1453945788=" + _reward + "&submit=Submit";
            	
            	var _url = "https://docs.google.com/forms/d/e/1FAIpQLSdBhcNkVqfyxnobmVvOHmtrdJKAwwrhW8PNO7vcFuVb9oVsnA/formResponse?usp=pp_url&entry.1293273134=" + _name + "&entry.17574046=" + _company + "&entry.122678687=" + _reward + "&submit=Submit";
            	
            	//var _url = "https://docs.google.com/forms/d/e/1FAIpQLSe3Wx0V61TT_KewfbGaTOzm_E3-5kXGwAT5W8WA7tV7_u5R5g/viewform?usp=pp_url&entry.1293273134=name&entry.17574046=cmoppanry&entry.122678687=123"
            	
            	document.getElementById("gform").action = _url;
            	document.getElementById("gform").submit();

            	//display result
            	var _results = "Вы набрали ";
            	_results = _results + self.payoutTotal;
            	if(self.payoutTotal > 0){
            		_results = _results + " баллов. Неплохо!";
            	}else{
            		_results = _results + " баллов. Повезёт в другой раз!";
            	}
            	_results = _results + " Ваш результат сохранён. Итоги будут подведены совсем скоро!";
            	document.getElementById("results").innerHTML = _results;







			},
			animateCredits: function() {

				var self = this;
				self.payoutTotal -= self.creditTimer;
				if (self.creditsSound) {
					self.options.slotData.countSound.play();
					self.creditsSound = false;
				}
				self.creditsWon.val(self.payoutTotal);
				self.options.slotData.totalCredits += self.creditTimer;
				self.creditsTotal.val(self.options.slotData.totalCredits);

				if (self.payoutTotal - self.creditTimer > 0) {
					setTimeout($.proxy(self.animateCredits, self), 50);

				} else {
					self.options.slotData.totalCredits += self.payoutTotal
					tempTotCredits = self.options.slotData.totalCredits;
					self.payoutTotal = 0;
					self.creditsWon.val(self.payoutTotal);
					self.creditsTotal.val(self.options.slotData.totalCredits);
					self.animStart = false;
					self.bindAll();
					self.options.slotData.countSound.stop();
				}


			},
			adjustEnd: function() {
				self = this;
				window.cancelRequestAnimationFrame(self.req);
				self.options.slotData.spinSound.stop();
				self.anim = !self.anim;

				//			alert(self.payout+"____"+self.options.slotData.imageValues[self.finElArr[0]].name+"____"+self.options.slotData.imageValues[self.finElArr[1]].name+"____"+self.options.slotData.imageValues[self.finElArr[2]].name);
				//console.log(self.finElArr)
			},
			bindAll: function() {
				var self = this;
				if(self.options.slotData.totalCredits>0){
				$("#betMax,#betOne,#spinBtn").attr("disabled", false);
				self.betMax.attr("disabled", false).bind("click", $.proxy(self.onBetMax, self));
				self.betOne.attr("disabled", false).bind("click", $.proxy(self.onBetOne, self));
				self.spinBtn.attr("disabled", false).bind("click", $.proxy(self.spinSlots, self));
				}
				//self.payoutBtn.bind("click", $.proxy(self.showPayTable, self));
			},

			unBindAll: function() {
				var self = this;
				self.betMax.attr("disabled", true).unbind("click");
				self.betOne.attr("disabled", true).unbind("click");
				self.spinBtn.attr("disabled", true).unbind("click");

			},
			showPayTable: function(e) {
				//console.log("E" + e);
				var self = this;

				
				if (self.showPayout) {
					self.currentPayImage = 0;
					self.showNextPayImage();
					$(self.ctx.canvas).bind("click",$.proxy(self.showNextPayImage, self));
					
				}
				else {
					$(self.ctx.canvas).unbind("click");
									self.ctx.clearRect(0, 0, self.ctx.canvas.width, self.ctx.canvas.height);

					for (var i = 0; i < self.imageObjs.length; i++)
					self.imageObjs[i].forEach($.proxy(self.draw, self));
				}

					e.preventDefault();
					self.showPayout = !self.showPayout;


			},
			showNextPayImage:function(){
				var self=this;
					self.ctx.clearRect(0, 0, self.ctx.canvas.width, self.ctx.canvas.height);
					
				self.payoutTable[self.currentPayImage].draw(self.ctx);
					if (++self.currentPayImage > self.payoutTable.length - 1) {
						self.currentPayImage = 0;
					}
					if(self.payoutTable.length>1)
					self.ctx.fillText("Click To see More",self.ctx.canvas.width-100,self.ctx.canvas.height-30);
			},
			drawLines: function() {
				var self = this;
				self.textOffset = 0;
				self.ctx.save();
				self.ctx.clearRect(0, 0, self.ctx.canvas.width, self.ctx.canvas.height);
				for (i = 0; i < self.totalColumns; i++) {
					self.currentRow = i;
					self.currArr = self.imageObjs[i];
					for (var j = 0; j < self.currArr.length; j++) {
						if (self.currArr[j].y > -self.options.slotData.imageHeight && self.currArr[j].y < self.ctx.canvas.height + self.options.slotData.imageHeight) {

							self.draw(self.currArr[j]);
						}
						self.currArr[j].rendered = false;

					}
				}
				//console.log(self.totalLines)
				for (var i = 0; i < self.totalLines; i++) {

					self.ctx.beginPath();
					self.ctx.strokeStyle = self.options.slotData.lineColors[i];
					self.ctx.fillStyle = self.options.slotData.lineColors[i];

					self.ctx.lineWidth = self.options.slotData.lineWidths[i];;


					self.drawLine(self.options.slotData.lines[i], "dsd")

					self.ctx.restore();
				}
			},
			drawLine: function(obj, txt) {
				var self = this;
				if (txt != undefined) {


					self.ctx.fillText(txt, 0, self.textOffset)
				}
				for (var j = 0; j < obj.split(",").length; j++) {
					if (j == 0) {
						if (obj.split(",")[j] == obj.split(",")[j + 1]) {


							self.ctx.moveTo(0 + self.options.slotData.extraWidth, obj.split(",")[0] * self.options.slotData.imageHeight + self.options.slotData.imageHeight / 2);

							self.ctx.lineTo((j + 1) * self.options.slotData.imageWidth + self.options.slotData.extraWidth + self.options.slotData.imageWidth / 2, obj.split(",")[j] * self.options.slotData.imageHeight + self.options.slotData.imageHeight / 2);
						}
						else if (obj.split(",")[j] < obj.split(",")[j + 1]) {
							self.ctx.moveTo(0 + self.options.slotData.extraWidth, obj.split(",")[j] * self.options.slotData.imageHeight);

							self.ctx.lineTo((j + 1) * self.options.slotData.imageWidth + self.options.slotData.extraWidth + self.options.slotData.imageWidth / 2, obj.split(",")[j] * self.options.slotData.imageHeight + self.options.slotData.imageHeight + self.options.slotData.imageHeight / 2);
						}
						else {
							self.ctx.moveTo(0 + self.options.slotData.extraWidth, obj.split(",")[0] * self.options.slotData.imageHeight + self.options.slotData.imageHeight);
							self.ctx.lineTo((j + 1) * self.options.slotData.imageWidth + self.options.slotData.extraWidth + self.options.slotData.imageWidth / 2, obj.split(",")[0] * self.options.slotData.imageHeight - self.options.slotData.imageHeight / 2);
						}
					} else if (j < obj.split(",").length - 1) {
						if (obj.split(",")[j] == obj.split(",")[j + 1]) {
							//self.ctx.moveTo(0,obj.split(",")[0]*self.options.slotData.imageHeight+self.options.slotData.imageHeight/2);

							self.ctx.lineTo((j + 1) * self.options.slotData.imageWidth + self.options.slotData.extraWidth + self.options.slotData.imageWidth / 2, obj.split(",")[j] * self.options.slotData.imageHeight + self.options.slotData.imageHeight / 2);
						}
						else if (obj.split(",")[j] < obj.split(",")[j + 1]) {

							self.ctx.lineTo((j + 1) * self.options.slotData.imageWidth + self.options.slotData.extraWidth + self.options.slotData.imageWidth / 2, obj.split(",")[j] * self.options.slotData.imageHeight + self.options.slotData.imageHeight + self.options.slotData.imageHeight / 2);

						} else {

							self.ctx.lineTo((j + 1) * self.options.slotData.imageWidth + self.options.slotData.extraWidth + self.options.slotData.imageWidth / 2, obj.split(",")[j] * self.options.slotData.imageHeight - self.options.slotData.imageHeight / 2);
						}
					}
					else {
						if (obj.split(",")[j] == obj.split(",")[j - 1]) {
							//self.ctx.moveTo(0,obj.split(",")[0]*self.options.slotData.imageHeight+self.options.slotData.imageHeight/2);

							self.ctx.lineTo((j + 1) * self.options.slotData.imageWidth + self.options.slotData.extraWidth, obj.split(",")[j] * self.options.slotData.imageHeight + self.options.slotData.imageHeight / 2);
						}
						else if (obj.split(",")[j] > obj.split(",")[j - 1]) {
							//self.ctx.moveTo(0,0);
							self.ctx.lineTo((j) * self.options.slotData.imageWidth + self.options.slotData.imageWidth + self.options.slotData.extraWidth, obj.split(",")[j] * self.options.slotData.imageHeight + self.options.slotData.imageHeight);
							//								self.ctx.lineTo((j+1)*self.options.slotData.imageWidth,obj.split(",")[j]*self.options.slotData.imageHeight+self.options.slotData.imageHeight);
						} else {

							self.ctx.lineTo((j) * self.options.slotData.imageWidth + self.options.slotData.imageWidth + self.options.slotData.extraWidth, obj.split(",")[j] * self.options.slotData.imageHeight);
						}
					}


				}
				self.ctx.stroke();



			},
			onBetMax: function(e) {
				e.preventDefault();
				var self = this;
				self.options.slotData.coinInsertSound.play()
				//alert(self.creditsBet+"___"+self.options.slotData.totalCredits)
				self.totalLines = self.options.slotData.lines.length;
				if (self.options.slotData.payBy == 1 && self.options.slotData.drawLines) {

					self.drawLines();
				}
				if (self.betClicked){ 
					self.options.slotData.totalCredits += self.creditsBet;
				}
				if(self.options.slotData.creditsMax<self.options.slotData.totalCredits)
				self.creditsBet = self.options.slotData.creditsMax;
				else
				self.creditsBet = self.options.slotData.totalCredits;
				self.options.slotData.totalCredits -= self.creditsBet;
				//	alert(self.creditsBet+"___"+self.options.slotData.totalCredits)

				self.creditsBetField.val(self.creditsBet);
				self.creditsTotal.val(self.options.slotData.totalCredits);
				self.betClicked = true;
				self.spinSlots(e);


				//			self.creditsBet=self.options.slotData.creditsMax;
				//		self.options.slotData.totalCredits +=self.creditsBet;
			},

			onBetOne: function(e) {
				e.preventDefault();
				var self = this;
				self.options.slotData.coinInsertSound.pause();
				self.options.slotData.coinInsertSound.play()
				if (self.options.slotData.payBy == 1) {

					if (self.totalLines++ >= self.options.slotData.lines.length) {
						self.totalLines = 0;
					}

					self.options.slotData.creditsMax = self.options.slotData.lines.length;
					if (self.options.slotData.drawLines) self.drawLines();
				} else {
					self.totalLines = 1;
				}
				if(self.options.slotData.totalCredits>0){
				self.creditsBet++;

				self.options.slotData.totalCredits--;
				}

				if (self.creditsBet > self.options.slotData.creditsMax) {

					self.options.slotData.totalCredits = tempTotCredits;
					self.creditsBet = 0;
				}

				self.creditsBetField.val(self.creditsBet);
				self.creditsTotal.val(self.options.slotData.totalCredits);
				if (self.creditsBet > 0) {
					self.spinBtn.attr("disabled", false).bind("click", $.proxy(self.spinSlots, self));
				} else {
					self.spinBtn.attr("disabled", true).unbind("click")
				}
				self.betClicked = true;

			},
			spinSlots: function(e) {

				e.preventDefault();
				var self = this;

				//console.log(this);
				if (!self.animStart&&self.creditsBet>0) {
					self.showPayout=false;
					self.showPayTable(e);
					
					self.unBindAll();
					self.creditsWon.val(0)
					if (!self.betClicked) {
						self.options.slotData.totalCredits -= self.creditsBet;
						self.creditsTotal.val(self.options.slotData.totalCredits);
					}
					tempTotCredits = self.options.slotData.totalCredits
					self.betClicked = false;
					var matched = false,
						partialMatch = false;

					self.animStart = true;
					matchedRows = 0;


					for (i = 0; i < self.totalColumns; i++) {
							self.finElArr[i] = (self.getRandomArbitary(0, self.imageObjs[i].length - 1));
							self.spinTimesCurrArr[i] = 0;
							self.markSpin[i] = true;
							self.spinTimesTotalArr[i] = self.getRandomArbitary(2, 3);
							self.vy[i] = self.oVy / self.spinTimesTotalArr[i];
							//console.log([self.finElArr[i]])
							//	self.finElArrMapped[i]= self.imageObjs[i][self.finElArr[i]].value;
							//console.log(i + "__" + self.finElArr[i] + "___" + self.imageObjs[i][self.finElArr[i]].value)

						}
					//	self.finElArr = [0, 0,0,0, 0]
					for (i = 0; i < self.totalLines; i++) {
							self.finElArrMapped[i] = [];
							for (j = 0; j < self.options.slotData.lines[i].split(",").length; j++) {
								var diff = self.options.slotData.lines[i].split(",")[j] - 1;

								if (self.finElArr[j] + diff < 0) {
									self.finElArrMapped[i][j] = self.imageObjs[j][self.imageObjs[j].length - 1].value
								} else if (self.finElArr[j] + diff > self.imageObjs[j].length - 1) {
									self.finElArrMapped[i][j] = self.imageObjs[j][0].value

								} else {
									self.finElArrMapped[i][j] = self.imageObjs[j][self.finElArr[j] + diff].value;
								}

							}
							self.payout = 0;
							quantity = 1 << self.finElArrMapped[i].length;
							self.finElStr = self.permutations(self.finElArrMapped[i].toString(), quantity)
							//					console.log("CHECK FOR:" + self.finElStr)
							whileLoop: while (quantity != 0) {

								//							console.log(quantity + ":::CHECK FOR:" + self.finElStr)
								for (k = 0; k < self.options.slotData.combinations.length; k++) {
									if (self.finElStr === self.options.slotData.combinations[k].combination) {
										self.payout = self.options.slotData.combinations[k].payout;

										break whileLoop;
									}
								}
								quantity--;
								self.finElStr = self.permutations(self.finElArrMapped[i].toString(), quantity);

							}
							//	console.log("OUT:" + self.payout);
							if (self.payout == 0) {
								self.payoutArr[i] = self.payout;
							} else {
								if (self.payout.split(",").length > 1) {
									self.payout = self.payout.split(",")[self.creditsBet - 1]
								}

								if (self.payout.indexOf("*") == -1) self.payoutArr[i] = parseInt(self.payout, 10);
								else self.payoutArr[i] = parseInt(self.payout.substr(1), 10) * self.creditsBet;
							}
							//console.log("PAYYYYYYYYYY:" + self.payoutArr)
						}
					//self.finElArr = [0, 0, 2];



					//	console.log(self.finElArr.toString())
					quantity = 1 << self.finElArr.length;
					self.finElStr = self.permutations(self.finElArrMapped.toString(), quantity)

					/*	whileLoop: while (self.finElStr != "-1,-1,-1") {
					 for (i = 0; i < self.options.slotData.combinations.length; i++) {
					 console.log(self.finElStr+" COMPARW WITH:"+self.options.slotData.combinations[i].combination);
					 if (self.finElStr === self.options.slotData.combinations[i].combination) {
					 console.log("MATCH FOUND:"+self.finElStr+"___"+self.options.slotData.combinations[i].combination);
					 self.payout = self.options.slotData.combinations[i].self.payout;
					 
					 break whileLoop;
					 }
					 }
					 quantity--;
					 self.finElStr = permutations(self.finElArrMapped.toString(), quantity);
					 
					 }*/
					//self.vy = self.oVy;
					self.options.slotData.spinSound.play();
					//				self.req = window.requestAnimationFrame($.proxy(self.drawFrame,self), self.ctx.canvas);
					self.drawFrame()
					self.anim = !self.anim;
				}

			},
			permutations: function(list, quantity) {
				var combinations = []; //All combinations
				var combination = []; //Single combination
				// var quantity = )(1 << list.length);
				list = list.split(",");
				for (var i = quantity - 1; i > -1; i--) {
					combination = [];
					for (var j = 0; j < list.length; j++) {
						if ((i & (1 << j))) {
							combination.push(list[j]);
						} else {
							combination.push("-1");
						}
					}
					if (combination.length !== 0) {
						combinations.push(combination);
						return combination.toString();
					}
				}

			},

			getRandomArbitary: function(min, max) {
				return Math.floor(Math.random() * (max - min + 1)) + min;
			},
			shuffleArray: function(originalArr) {
				var self = this;
				var arr = []
				while (arr.length < originalArr.length) {
					var randomnumber = self.getRandomArbitary(0, originalArr.length - 1);
					var found = false;
					for (var i = 0; i < arr.length; i++) {
						if (arr[i] == randomnumber) {
							found = true;
							break
						}
					}
					if (!found) arr[arr.length] = randomnumber;
				}

				for (i = 0; i < arr.length; i++) {
					arr[i] = originalArr[arr[i]];
				}
				return (arr);
			}

		}


	//Main plugin
	$.fn.slotMachine = function(options) {
			return this.each(function() {

				var slot = Object.create(SlotMachine);
				//youtube.init("m3nF69AHKcw");
				slot.init(options, this);
			});
		};
	//Defaults
	$.fn.slotMachine.options = {
			slotData: null,
			slotControls: null
		};

})(jQuery, window, document);