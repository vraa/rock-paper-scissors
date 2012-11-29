
var rps= {

	humanScore:0,
	botScore:0,
	gameStarted:0,
	humanChoice:null,
	botChoice: null,
	choiceList:["rock", "paper", "scissor"],

	init: function(){
		rps.humanScore = 0;
		rps.botScore = 0;
		rps.humanChoice = $(".human .choice");
		rps.botChoice = $(".bot .choice");
		
		rps.humanChoice.find("a").bind("click", rps.humanThink);
		rps.refreshScore();
		rps.resetGame();
		
		/* bind events */
		$(".menu a").click(rps.showOverlay);
		$("#start-new").click(function(){
			location.reload();
		});
	},
	
	resetGame: function(){
		$(".winner").removeClass("winner");
		$(".loser").removeClass("loser");
		rps.humanChoice.removeClass("chosen");
		rps.botChoice.find("a").removeClass().addClass("rock icon").attr("id", "rock");
		rps.gameStarted = 0;
	},
	
	humanThink: function(){
		rps.resetGame();
		var humanChosen = $(this);
		if(rps.gameStarted == 0){
			rps.gameStarted = 1;
			rps.humanChoice.addClass("chosen");
			rps.humanChoice.find(".active").removeClass("active");
			humanChosen.addClass("active");
			$('.human h4').html('...Bot thinking...').show('slow');
			rps.botChoice.find("li").animate({
				marginTop: '+=20'
			}, 200, function(){
				$(this).animate({
					marginTop: '-=20'
				}, 200, function(){
					$(this).animate({
						marginTop:'+=20'
					}, 200, function(){
						$(this).animate({
							marginTop:'-=20'
						}, 200, function(){
							$(this).animate({
								marginTop:'+=20'
							}, 200, function(){
								$(this).animate({
									marginTop:'-=20'
								}, 200, rps.botThink);
							});
						});
					});
				});
			});
		}else{
			return;
		}
	},
	
	botThink: function(){
		var botChosen = rps.choiceList[Math.floor(Math.random() * rps.choiceList.length)];
		rps.botChoice.find("a").removeClass("rock").addClass(botChosen).attr("id", botChosen);;
		rps.decideWinner();
	},
	
	decideWinner: function(){
		var human = $(".human .choice .active").attr("id");
		var bot = $(".bot .choice a").attr("id");
		var winner = "noone";
		if(human == bot){
			winner = "noone";
		}else if(human == "rock"){
			if(bot == "paper"){
				winner = "bot";
			}else{
				winner = "human";
			}
		}else if(human == "paper"){
			if(bot == "scissor"){
				winner = "bot";
			}else{
				winner = "human";
			}
		}else if(human == "scissor"){
			if(bot == "rock"){
				winner = "bot";
			}else{
				winner = "human";
			}
		}
		
		var announcer = $('.human h4');
		if(winner == "human"){
			rps.humanScore += 1;
			announcer.html('You win! <strong>' + human + '</strong> beats <strong>' + bot + '</strong> left and right!');
		}else if(winner == "bot"){
			rps.botScore += 1;
			announcer.html('Bot win! <strong>' + human + '</strong> never messes with <strong>' + bot + '</strong>!');
		}else{
			announcer.html('No one wins. Go in peace or Try again!');
		}
		
		$("." + winner).addClass("winner");
		$(".player:not('.winner')").addClass("loser");
		rps.refreshScore();
		rps.refreshPlayerWeight();
		rps.refreshBombPosition(winner);
		
		rps.humanChoice.find("a:not('.active')").animate({
			opacity:1
		}, 1000, function(){
			$(this).removeAttr("style");
			rps.humanChoice.removeClass("chosen");
		});
	},
	
	refreshScore: function(){
		$(".human .score").html(rps.humanScore);
		$(".bot .score").html(rps.botScore);
	},
	
	refreshPlayerWeight: function(){
		var deg = (rps.humanScore - rps.botScore) * 2;
		$(".players").css("-moz-transform", "rotate(" + deg + "deg)");
		$(".players").css("-webkit-transform", "rotate(" + deg + "deg)");
	},
	
	refreshBombPosition: function(winner){
		if(winner != "noone"){
			if(winner == "human"){
				$(".bot .bomb").animate({
					marginRight:'-=30'
				},300);
				$(".human .bomb").animate({
					marginLeft:'+=30'
				},300);
			}else if(winner == "bot"){
				$(".human .bomb").animate({
					marginLeft:'-=30'
				},300);
				$(".bot .bomb").animate({
					marginRight:'+=30'
				},300);
			}
			window.setTimeout(function(){
				var diff = rps.humanScore - rps.botScore;
				if(diff < 0) diff = -1 * diff;
				if(diff >= 3){
					rps.showWinningMessage();
				}
			}, 600);
		}
	},
	
	showOverlay: function(){
		rps.echo($(this));
		var id = $(this).attr("id");
		$("#" + id + "-content").modal();
	},
	
	showWinningMessage: function(){
		if(rps.humanScore > rps.botScore){
			$("#win-content .human-won").removeClass("hidden");
		}else{
			$("#win-content .bot-won").removeClass("hidden");
		}
		
		$("#win-content").modal({onClose:function(dialog){
			$.modal.close();
			location.reload();
		}, containerCss: {
			height:300,
			paddingTop:20,
			paddingBottom:20
		}});
		
	},
	
	echo: function(msg){
		console.log(msg);
	}
}

$(document).ready(rps.init);