function enviarDemoWhats(){
  const nome = (document.querySelector('input[name="nome"]')?.value || '').trim();
  const telefone = (document.querySelector('input[name="telefone"]')?.value || '').trim();
  const escola = (document.querySelector('input[name="escola"]')?.value || '').trim();

  if(!nome || !telefone || !escola){
    alert("Preencha Nome, Telefone e Nome da escola.");
    return;
  }

  const numero = "5531999813140";

  const msg =
    "Olá! Quero agendar uma demonstração do Conect360.%0A%0A" +
    "Nome: " + encodeURIComponent(nome) + "%0A" +
    "Telefone: " + encodeURIComponent(telefone) + "%0A" +
    "Escola: " + encodeURIComponent(escola);

  window.open("https://wa.me/" + numero + "?text=" + msg, "_blank", "noopener");
}

function mostrarInstrucaoInstalacao(texto){
  let box = document.getElementById("installConect360Box");

  if(!box){
    box = document.createElement("div");
    box.id = "installConect360Box";
    box.style.position = "fixed";
    box.style.top = "90px";
    box.style.right = "20px";
    box.style.zIndex = "9999";
    box.style.maxWidth = "360px";
    box.style.background = "rgba(15,23,42,.96)";
    box.style.color = "#fff";
    box.style.border = "1px solid rgba(255,255,255,.18)";
    box.style.borderRadius = "16px";
    box.style.padding = "16px";
    box.style.boxShadow = "0 18px 50px rgba(0,0,0,.45)";
    box.style.fontWeight = "800";
    box.style.lineHeight = "1.5";

    document.body.appendChild(box);
  }

  box.innerHTML = `
    <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;">
      <div>
        <div style="font-size:15px;margin-bottom:6px;">📲 Instalar Conect360</div>
        <div style="font-size:13px;color:rgba(255,255,255,.78);">${texto}</div>
      </div>
      <button type="button" onclick="document.getElementById('installConect360Box').remove()"
        style="background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.18);color:#fff;border-radius:999px;width:28px;height:28px;cursor:pointer;">
        ×
      </button>
    </div>
  `;
}

let conect360InstallPrompt = null;

window.addEventListener("beforeinstallprompt", function(event){
  event.preventDefault();
  conect360InstallPrompt = event;

  const btn = document.getElementById("btnInstallConect360");
  if(btn){
    btn.style.display = "inline-flex";
  }
});

document.addEventListener("DOMContentLoaded", function(){
  const btnInstall = document.getElementById("btnInstallConect360");

  if(btnInstall){
    btnInstall.addEventListener("click", async function(){
      if(conect360InstallPrompt){
        conect360InstallPrompt.prompt();
        await conect360InstallPrompt.userChoice;
        conect360InstallPrompt = null;
        btnInstall.style.display = "none";
        return;
      }

      const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

      if(isIOS && isSafari){
        mostrarInstrucaoInstalacao("No iPhone, toque no botão Compartilhar do Safari e depois em 'Adicionar à Tela de Início'.");
      }else{
        mostrarInstrucaoInstalacao("No computador ou Android, abra o menu do navegador e escolha 'Instalar app' ou 'Adicionar à tela inicial'.");
      }
    });
  }

  const slides = Array.from(document.querySelectorAll(".home360-slide"));
  const prev = document.getElementById("home360Prev");
  const next = document.getElementById("home360Next");
  const dotsWrap = document.getElementById("home360Dots");
  const top = document.getElementById("home360Top");

  if(slides.length){
    let idx = slides.findIndex(function(slide){
      return slide.classList.contains("active");
    });

    if(idx < 0){
      idx = 0;
    }

    function renderDots(){
      if(!dotsWrap){
        return;
      }

      dotsWrap.innerHTML = "";

      slides.forEach(function(_, k){
        const b = document.createElement("button");
        b.type = "button";
        b.className = "home360-dot" + (k === idx ? " active" : "");
        b.setAttribute("aria-label", "Ir para slide " + (k + 1));
        b.addEventListener("click", function(){
          go(k);
        });
        dotsWrap.appendChild(b);
      });
    }

    function go(i){
      slides[idx].classList.remove("active");
      idx = (i + slides.length) % slides.length;
      slides[idx].classList.add("active");
      renderDots();
    }

    renderDots();

    if(prev){
      prev.addEventListener("click", function(){
        go(idx - 1);
      });
    }

    if(next){
      next.addEventListener("click", function(){
        go(idx + 1);
      });
    }

    let timer = setInterval(function(){
      go(idx + 1);
    }, 6500);

    const hero = document.querySelector(".home360-hero");

    if(hero){
      hero.addEventListener("mouseenter", function(){
        clearInterval(timer);
      });

      hero.addEventListener("mouseleave", function(){
        timer = setInterval(function(){
          go(idx + 1);
        }, 6500);
      });
    }
  }

  if(top){
    top.addEventListener("click", function(e){
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
});