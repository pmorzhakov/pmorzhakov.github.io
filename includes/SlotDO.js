//Slot Data Object
function SlotDO() {
	//payBy lines or credits. '0' for Credits '1' for lines. For lines, each line will add a credit. so far example user wants to play 3 lines=3coins,4lines=4 coins so on.
	this.payBy=1;
	//Set to draw lines on winning and to see multiple lines when clicked on bet
	this.drawLines=true;
	//Set to true to shuffle the images randomly.
	this.shuffleSlots=true;
	//Values for all the images that will be displayed
	this.imageValues = new Array({
			name : "spade",
			value : 5,
			path : "images/spade.png"
		}, {
			name : "club",
			value : 6,
			path : "images/club.png"
		}, {
			name : "diamond",
			value : 7,
			path : "images/diamond.png"
		}, {
			name : "heart",
			value : 8,
			path : "images/heart.png"
		}, {
			name : "bell",
			value : 9,
			path : "images/bell.png"
		}, {
			name : "seven",
			value : 10,
			path : "images/seven.png"
		});
	//An array of arrays. Each array indicates a slot line.
	this.images = [
		//new Array("cherry", "cherry", "cherry", "cherry", "lemon", "plum", "orange", "melon", "spade", "club", "diamond", "heart", "bell", "seven"),
		new Array( "spade", "club", "diamond", "heart", "bell", "seven","spade", "club", "diamond", "heart", "bell", "seven"),
		new Array( "spade", "club", "diamond", "heart", "bell", "seven","spade", "club", "diamond", "heart", "bell", "seven"),
		new Array( "spade", "club", "diamond", "heart", "bell", "seven","spade", "club", "diamond", "heart", "bell", "seven"),		
		new Array("spade", "club", "diamond", "heart", "bell", "seven","spade", "club", "diamond", "heart", "bell", "seven"),
		new Array( "spade", "club", "diamond", "heart", "bell", "seven","spade", "club", "diamond", "heart", "bell", "seven")
		
	
		
	];
	//Array of strings. Each string represents a winnin combination line. 0 being the top row of each column.
	this.lines = ["1,1,1,1,1", "0,0,0,0,0", "2,2,2,2,2", "0,1,2,1,0", "2,1,0,1,2","0,1,0,1,0"],
	//this.lines = ["1,1,1"];
	//Set colors for each line.
	this.lineColors=["#FF0000","#00FF00","#0000FF","#00FFFF","#FFFFFF","#000000","#AA00FF","#5500FF"];
	this.lineWidths=[10,10,10,5,5,5,5,5,5,5,5,5];
	this.fontStyle="digital-7regular bold 12px";
	//Array of objects. Each object contains a winning combination and the payout amount. use -1 to represent ANY. Payout is a string of values for no.of coins. The first value in the string represents the payout for 1 coin, second for 2 and so on. If you want the values to be multiplied by no.of coins, just enter one value.
	this.combinations = new Array({
			combination : "10,10,-1,-1,-1",
			payout : "5"
		},
		{
			combination : "10,10,10,-1,-1",
			payout : "50"
		},
		{
			combination : "10,10,10,10,-1",
			payout : "250"
		},
		{
			combination : "10,10,10,10,10",
			payout : "2500"
		},{
			combination : "9,9,-1,-1,-1",
			payout : "2"
		},
		{
			combination : "9,9,9,-1,-1",
			payout : "25"
		},
		{
			combination : "9,9,9,9,-1",
			payout : "100"
		},
		{
			combination : "9,9,9,9,9",
			payout : "500"
		},{
			combination : "8,8,-1,-1,-1",
			payout : "2"
		},
		{
			combination : "8,8,8,-1,-1",
			payout : "20"
		},
		{
			combination : "8,8,8,8,-1",
			payout : "80"
		},
		{
			combination : "8,8,8,8,8",
			payout : "400"
		},
		{
			combination : "7,7,7,-1,-1",
			payout : "10"
		},
		{
			combination : "7,7,7,7,-1",
			payout : "75"
		},
		{
			combination : "7,7,7,7,7",
			payout : "350"
		},
		{
			combination : "6,6,6,-1,-1",
			payout : "10"
		},
		{
			combination : "6,6,6,6,-1",
			payout : "50"
		},
		{
			combination : "6,6,6,6,6",
			payout : "250"
		},
		{
			combination : "5,5,5,-1,-1",
			payout : "5"
		},
		{
			combination : "5,5,5,5,-1",
			payout : "50"
		},
		{
			combination : "5,5,5,5,5",
			payout : "125"
		}
		
		);
		//Total credits at start
		this.totalCredits = 150;
		//Maximum credits that could be bet
		this.creditsMax = 3;
		this.imageHeight = 128;
	this.imageWidth = 128;
	this.extraWidth = 150;
		this.payTableImages=["images/payouts3.png"];

			this.coinInsertSound = new buzz.sound(["audio/Inserting Coin - 1.mp3", "audio/Inserting Coin - 1.wav"], {
		preload: true,
		loop: false
	}),
		this.spinSound = new buzz.sound(["audio/Slot ditty/mp3/dittty1_roll.mp3", "audio/Slot ditty/wav/dittty1_roll.wav"], {
			preload: true,
			loop: true
		}),
		this.winSound = new buzz.sound(["audio/Jackpot Winner - 1.wav", "audio/Jackpot Winner - 1.wav", ], {
			preload: true,
			loop: false
		}),
		this.countSound = new buzz.sound(["audio/Money Winner - 2.mp3", "audio/Money Winner - 2.wav"], {
			preload: true,
			loop: true
		})

}
