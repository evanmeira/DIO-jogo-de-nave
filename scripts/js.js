function start(){
  
  let jogo = {};
  const TECLA = {
    W: 87,
    S: 83,
    D: 68,
    ARROW_UP: 38
  };
  let velocidade = 5;
  let posicaoY = parseInt(Math.random() * 334);
  let podeAtirar = true;
  let fimDeJogo = false;
  let pontos = 0;
  let salvos = 0;
  let perdidos = 0;
  let energiaAtual = 3;

  let somDisparo = document.getElementById('somDisparo');
  let somExplosao = document.getElementById('somExplosao');
  let musica =  document.getElementById('musica');
  let somGameover = document.getElementById('somGameover');
  let somPerdido = document.getElementById('somPerdido');
  let somResgate = document.getElementById('somResgate');

  musica.addEventListener('ended', () => {
    musica.currentTime = 0;
    musica.play();
  }, false);
  musica.play();

  function loop(){
    moveFundo();
    moveJogador();
    moveInimigo1();
    moveInimigo2();
    moveAmigo();
    colisao();
    placar();
    energia();
  }

  function moveFundo(){
    esquerda = parseInt($('#fundoGame').css('background-position'));
    $('#fundoGame').css('background-position', esquerda-1);    
  }

  function moveJogador(){
    
    if(jogo.pressionou[TECLA.W]){
      let topo = parseInt($('#jogador').css('top'));
      $('#jogador').css('top', topo - 10);

      if(topo <= 0){
        $('#jogador').css('top', topo+10);
      }
    }

    if(jogo.pressionou[TECLA.S]){
      let topo = parseInt($('#jogador').css('top'));
      $('#jogador').css('top', topo + 10);

      if(topo >= 434){
        $('#jogador').css('top', topo - 10);
      }
    }

    if(jogo.pressionou[TECLA.D]){
      disparar();
    }
  }

  function moveInimigo1(){
    posicaoX = parseInt($('#inimigo1').css('left'));
    $('#inimigo1').css('left', posicaoX - velocidade);
    $('#inimigo1').css('top', posicaoY);

    if( posicaoX <= 0){
      posicaoY = parseInt(Math.random() * 334);
      $('#inimigo1').css('left', 694);
      $('#inimigo1').css('top', posicaoY);
    }
  }

  function moveInimigo2(){
    posicaoX = parseInt($('#inimigo2').css('left'));
    $('#inimigo2').css('left', posicaoX - 3);

    if( posicaoX <= 0){
      $('#inimigo2').css('left', 775);
    }
  }

  function moveAmigo(){
    posicaoX = parseInt($('#amigo').css('left'));
    $('#amigo').css('left', posicaoX + 1);

    if( posicaoX >= 906){
      $('#amigo').css('left', 0);
    }
  }

  function disparar(){
    if(podeAtirar === true){
      somDisparo.play();
      podeAtirar = false;

      topo = parseInt($('#jogador').css('top'));
      posicaoX = parseInt($('#jogador').css('left'));
      
      tiroX = posicaoX + 190;
      tiroTopo =  topo + 37;

      $('#fundoGame').append("<div id='disparo'></div>");
      $('#disparo').css('left', tiroX);
      $('#disparo').css('top', tiroTopo);

      var tempoDisparo = window.setInterval(executaDisparo, 30);
    }

    function executaDisparo(){
      posicaoX = parseInt($('#disparo').css('left'));
      $('#disparo').css('left', posicaoX + 15);

      if(posicaoX > 900){
        window.clearInterval(tempoDisparo);
        tempoDisparo = null;
        $('#disparo').remove();
        podeAtirar = true;
      }
    }
  }

  function colisao(){
    let colisaoJogadorInimigo1 = $('#jogador').collision($('#inimigo1'));
    let colisaoJogadorInimigo2 = $('#jogador').collision($('#inimigo2'));
    let colisaoDisparoInimigo1 = $('#disparo').collision($('#inimigo1'));
    let colisaoDisparoInimigo2 = $('#disparo').collision($('#inimigo2'));
    let colisaoJogadorAmigo = $('#jogador').collision($('#amigo'));
    let colisaoInimigo2Amigo = $('#inimigo2').collision($('#amigo'));

    if(colisaoJogadorInimigo1.length > 0){
      inimigo1X = parseInt($('#inimigo1').css('left'));
      inimigo1Y = parseInt($('#inimigo1').css('top'));
      explosao1(inimigo1X, inimigo1Y);

      posicaoY = parseInt(Math.random() * 334);
      $('#inimigo1').css('left', 694);
      $('#inimigo1').css('top', posicaoY);

      energiaAtual--;
    }

    if(colisaoJogadorInimigo2.length > 0){
      inimigo2X = parseInt($('#inimigo2').css('left'));
      inimigo2Y = parseInt($('#inimigo2').css('top'));
      explosao2( inimigo2X, inimigo2Y);

      $('#inimigo2').remove();

      reposicionaInimigo2();

      energiaAtual--;
    }

    if(colisaoDisparoInimigo1.length > 0){
      inimigo1X = parseInt($('#inimigo1').css('left'));
      inimigo1Y = parseInt($('#inimigo1').css('top'));
      explosao1(inimigo1X, inimigo1Y);
      $('#disparo').css('left', 950);

      posicaoY = parseInt(Math.random() * 334);
      $('#inimigo1').css('top', posicaoY);
      $('#inimigo1').css('left', 694);

      pontos += 100;
      velocidade += 0.3;
    }

    if(colisaoDisparoInimigo2.length > 0){
      inimigo2X = parseInt($('#inimigo2').css('left'));
      inimigo2Y = parseInt($('#inimigo2').css('top'));
      explosao2(inimigo2X, inimigo2Y);
      $('#disparo').css('left', 950);

      $('#inimigo2').remove();      
      reposicionaInimigo2();

      pontos += 50;
    }

    if(colisaoJogadorAmigo.length > 0){
      somResgate.play();
      $('#amigo').remove();
      reposicionaAmigo();

      salvos += 1;
    }

    if(colisaoInimigo2Amigo.length > 0){
      somPerdido.play();
      amigoX = parseInt($('#amigo').css('left'));
      amigoY = parseInt($('#amigo').css('top'));
      explosao3(amigoX, amigoY);
      $('#amigo').remove();
      
      reposicionaAmigo();

      perdidos += 1;
    }
  }

  function explosao1(x, y){
    somExplosao.play();
    $('#fundoGame').append("<div id='explosao1'></div>");
    $('#explosao1').css('background-image', "url(assets/imgs/explosao.png)");
    $('#explosao1').css('top', y);
    $('#explosao1').css('left', x);
    $('#explosao1').animate({width: 200, opacity: 0}, 'slow');

    var tempoExplosao = window.setInterval( () => {
      $('#explosao1').remove();
      window.clearInterval(tempoExplosao);
      tempoExplosao = null;
    }, 1000);
  }

  function explosao2(x, y){
    somExplosao.play();
    $('#fundoGame').append("<div id='explosao2'></div>");
    $('#explosao2').css('background-image', 'url(assets/imgs/explosao.png)');
    $('#explosao2').css('top', y);
    $('#explosao2').css('left', x);
    $('#explosao2').animate({width: 200, opacity: 0}, 'slow');

    var tempoExplosao2 = window.setInterval(()=>{
      window.clearInterval(tempoExplosao2);
      tempoExplosao2 = null;
      $('#explosao2').remove();
    }, 1000);
  }

  function explosao3(x, y){
    $('#fundoGame').append("<div id='explosao3' class='anima4'></div>");
    $('#explosao3').css('top', y);
    $('#explosao3').css('left', x);

    var tempoExplosao3 = window.setInterval(()=>{
      $('#explosao3').remove();
      window.clearInterval(tempoExplosao3);
      tempoExplosao3 = null;

      //reposicionaAmigo();
    }, 1000);

  }

  function reposicionaInimigo2(){
    var tempoColisaoJogadorInimigo2 = window.setInterval(()=>{
      window.clearInterval(tempoColisaoJogadorInimigo2);
      tempoColisaoJogadorInimigo2 = null;

      if(!fimDeJogo){
        $('#fundoGame').append("<div id='inimigo2'></div>");
      }
    }, 5000);
  }

  function reposicionaAmigo(){
    var tempoAmigo = window.setInterval(()=>{
      window.clearInterval(tempoAmigo);
      tempoAmigo = null;

      if(!fimDeJogo){
        $('#fundoGame').append("<div id='amigo' class='anima3'></div>");
      }
    }, 6000);
  }

  function placar(){
    $('#placar').html(`<h2>
     Pontos: ${pontos} 
     Salvos: ${salvos} 
     Perdidos: ${perdidos}
     </h2>`);   
  }

  function energia(){
    if(energiaAtual > 0 && energiaAtual < 4){
      $('#energia').css('background-image', `url(assets/imgs/energia${energiaAtual}.png`);
    }else{
      $('#energia').css('background-image', 'url(assets/imgs/energia0.png');
      gameover();
    }
  }

  function gameover(){
    fimDeJogo = true;
    musica.pause();
    somGameover.play();

    window.clearInterval(jogo.timer);
    jogo.timer = null;

    $('#jogador').remove();
    $('#inimigo1').remove();
    $('#inimigo2').remove();
    $('#amigo').remove();

    $('#fundoGame').append("<div id='fim'></div>");

    $('#fim').html(`
     <h1>Game OVer</h1>
     <p>Pontuação: ${pontos}</p>     
     <h3 id='reinicia'>Jogar novamente</h3>`);
    
    $('#reinicia').click(reiniciaJogo);
  }


  $('#inicio').hide();
  $('#fundoGame').append("<div id='jogador' class='anima1'></div>");
  $('#fundoGame').append("<div id='inimigo1'class='anima2'></div>");
  $('#fundoGame').append("<div id='inimigo2'></div>");
  $('#fundoGame').append("<div id='amigo' class='anima3'></div>");
  $('#fundoGame').append("<div id='placar'></div>");
  $('#fundoGame').append("<div id='energia'></div>");
  
  jogo.pressionou = [];
  $(document).keydown( e => {
    jogo.pressionou[e.which] = true;
  });
  $(document).keyup( e =>{
    jogo.pressionou[e.which] = false;
  });


  jogo.timer = setInterval(loop, 30);
}

function reiniciaJogo(){
  somGameover.pause();
  $('#fim').remove();
  start();
}

$('#inicio').click(start);