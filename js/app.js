/* Interface : rendu, filtres, navigation */
const CYCLES={"1":"Cycle 1 · maternelle","2":"Cycle 2 · CP–CE2","3":"Cycle 3 · CM1–6e","4":"Cycle 4 · 5e–3e"};

/* ---------- Rendu accueil ---------- */
const esc=s=>String(s);
const LV=["PS","MS","GS","CP","CE1","CE2","CM1","CM2","6e","5e","4e","3e"];
function levels(niv){const pr=niv.split(/\s*[–-]\s*/).map(x=>x.trim());const a=LV.indexOf(pr[0]),b=LV.indexOf(pr[pr.length-1]);return a<0||b<0?[]:LV.slice(a,b+1)}
function card(p){return `<a class="pcard" href="#${p.id}" data-c="${p.cycle}" data-m="${p.moment}" data-t="${p.textile?1:0}" data-l=" ${levels(p.niv).join(" ")} "><div class="art">${p.hero}</div><div class="body"><span class="eyebrow">${p.niv}</span><h3>${p.titre}</h3><p>${p.accroche}</p><div class="meta">${p.moment!=="Toute l’année"?`<span class="tag ev">${p.moment}</span>`:""}${p.textile?`<span class="tag tx">tissu</span>`:""}<span class="tag">${p.duree}</span><span class="tag ${p.machine.startsWith("Aucune")?"":"mach"}">${p.machine.startsWith("Aucune")?"sans machine":"machine"}</span><span class="tag">${p.diff}</span></div></div></a>`}
document.getElementById("cards").innerHTML=P.map(card).join("");
document.getElementById("hero-art").innerHTML=["couronne-mains","flocons","vitrail","lanterne"].map(id=>P.find(x=>x.id===id)).map(p=>`<a href="#${p.id}" aria-label="${p.titre}">${p.hero}</a>`).join("");
const FIL={c:"all",m:"all",l:"all"};
document.getElementById("lvsel").addEventListener("change",e=>{FIL.l=e.target.value;applyFilters()});
function applyFilters(){let n=0;document.querySelectorAll(".pcard").forEach(c=>{const ok=(FIL.c==="all"||c.dataset.c===FIL.c)&&(FIL.m==="all"||(FIL.m==="textile"?c.dataset.t==="1":c.dataset.m===FIL.m))&&(FIL.l==="all"||c.dataset.l.includes(" "+FIL.l+" "));c.hidden=!ok;if(ok)n++});document.getElementById("nores").hidden=n>0}
document.querySelectorAll("#cfilters .chip").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("#cfilters .chip").forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));FIL.c=b.dataset.f;applyFilters()}));
document.querySelectorAll("#mfilters .chip").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("#mfilters .chip").forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));FIL.m=b.dataset.m;applyFilters()}));

/* ---------- Bloc didactique ---------- */
function didacBlock(p){const d=D[p.id];if(!d)return "";
return `<div class="sec prof didac">
  <header><p class="eyebrow">Côté didactique</p><h2>Ce projet dans votre séquence</h2></header>
  <div class="remplace"><span class="eyebrow">La séance que ce projet remplace</span><p>${d.remplace}</p><span class="phasechip">${d.phase}</span></div>
  <div><h3 style="margin-bottom:6px">Notions visées et moment du projet</h3>
  <div class="ntable"><table><thead><tr><th>Discipline</th><th>Notion visée</th><th>Où dans le projet</th></tr></thead><tbody>${d.notions.map(n=>`<tr><td class="disc">${n[0]}</td><td>${n[1]}</td><td class="moment">${n[2]}</td></tr>`).join("")}</tbody></table></div></div>
  <div class="two">
    <div><h3 style="margin-bottom:10px">Pourquoi c’est plus efficace qu’une fiche</h3><ul class="clean learn">${d.gain.map(g=>`<li>${g}</li>`).join("")}</ul></div>
    <div><h3 style="margin-bottom:10px">Questions de relance</h3><ul class="clean learn">${d.relances.map(g=>`<li>« ${g} »</li>`).join("")}</ul><h4 style="margin-top:16px">Vocabulaire à installer</h4><div class="vocab">${d.vocab.map(v=>`<span>${v}</span>`).join("")}</div></div>
  </div>
  <div><h3 style="margin-bottom:10px">Les représentations des élèves</h3><div class="concep">${d.concep.map(c=>`<div><p class="avant">${c[0]}</p><p class="apres">${c[1]}</p></div>`).join("")}</div></div>
  <div class="two">
    <div class="cahier"><h3>Trace écrite</h3>${d.trace}</div>
    <div><h3 style="margin-bottom:10px">Différencier</h3><div class="diffcols"><div><h4>Coups de pouce</h4><ul class="clean learn">${d.aide.map(a=>`<li>${a}</li>`).join("")}</ul></div><div><h4>Pour les plus rapides</h4><ul class="clean learn">${d.expert.map(a=>`<li>${a}</li>`).join("")}</ul></div></div></div>
  </div>
</div>`}

/* ---------- Page « Par notion » ---------- */
const GROUPS={maths:["Mathématiques","Se repérer dans l’espace"],sciences:["Sciences et technologie","Physique-chimie","Découvrir le monde","Questionner le monde"],francais:["Langage et français"],langues:["Langues vivantes"],emc:["Enseignement moral et civique"],arts:["Arts plastiques","Éducation musicale"]};
const GLABEL={maths:"Mathématiques",sciences:"Sciences et technologie",francais:"Langage et français",langues:"Langues vivantes",emc:"Enseignement moral et civique",arts:"Arts plastiques et musique"};
function renderNotions(g){
  const keys=g&&GROUPS[g]?[g]:Object.keys(GROUPS);
  document.querySelectorAll("#discfilters .chip").forEach(c=>c.setAttribute("aria-pressed",c.dataset.g===(g&&GROUPS[g]?g:"all")?"true":"false"));
  document.getElementById("notions-list").innerHTML=keys.map(k=>{
    const rows=[];P.forEach(p=>{(D[p.id]?.notions||[]).forEach(n=>{if(GROUPS[k].includes(n[0]))rows.push([n[1],p.niv,p,n[2]])})});
    if(!rows.length)return "";
    const nsp=SPALL.filter(s=>(s.disc||[]).some(x=>GROUPS[k].includes(x))).length;
    return `<div class="disc-group"><h3>${GLABEL[k]}</h3>${nsp?`<p class="notionlink">Ces notions dans des projets ouverts : <a href="#cr-banque?d=${k}">${nsp} situations-problèmes de la banque</a></p>`:""}<div class="ntable box" style="padding:6px 14px"><table><thead><tr><th>Notion</th><th>Niveau</th><th>Projet</th><th>À quel moment</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r[0]}</td><td class="mono" style="white-space:nowrap">${r[1]}</td><td><a href="#${r[2].id}">${r[2].titre}</a></td><td class="moment">${r[3]}</td></tr>`).join("")}</tbody></table></div></div>`}).join("");
}
document.querySelectorAll("#discfilters .chip").forEach(b=>b.addEventListener("click",()=>{location.hash=b.dataset.g==="all"?"notions":"notions-"+b.dataset.g}));


/* ---------- Programmes applicables en 2026-2027 (vérifiés au BO le 1er octobre 2026) ---------- */
const BO={
 M26:{b:"BO n°19 du 7 mai 2026",u:"https://www.education.gouv.fr/bo/2026/Hebdo19/MENE2608627A"},
 FM24:{b:"BO n°41 du 31 octobre 2024",u:"https://www.education.gouv.fr/bo/2024/Hebdo41/MENE2415135A"},
 FM25:{b:"BO n°16 du 17 avril 2025",u:"https://www.education.gouv.fr/bo/2025/Hebdo16/MENE2504620A"},
 FM26:{b:"BO n°10 du 5 mars 2026",u:"https://www.education.gouv.fr/bo/2026/Hebdo10/MENE2602912A"},
 ST26:{b:"BO n°24 du 11 juin 2026",u:"https://www.education.gouv.fr/bo/2026/Hebdo24/MENE2611650A"},
 EH26:{b:"BO n°22 du 28 mai 2026",u:"https://www.education.gouv.fr/bo/2026/Hebdo22/MENE2608631A"},
 LV26:{b:"BO n°12 du 19 mars 2026",u:"https://www.education.gouv.fr/bo/2026/Hebdo12/MENE2602911A"},
 LV25:{b:"BO n°22 du 29 mai 2025",u:"https://www.education.gouv.fr/bo/2025/Hebdo22/MENE2504621A"},
 EMC24:{b:"BO n°24 du 13 juin 2024",u:"https://www.education.gouv.fr/bo/2024/Hebdo24/MENE2413934A"},
 T24:{b:"BO n°9 du 29 février 2024",u:"https://www.education.gouv.fr/bo/2024/Hebdo9/MENE2402802A"},
 P20:{b:"BO n°31 du 30 juillet 2020",u:"https://www.education.gouv.fr/bo/20/Hebdo31/MENE2018714A.htm"}
};
const MATL=["PS","MS","GS"];
const PROW={"Mathématiques":"Mathématiques","Langage et français":"Français","Sciences et technologie":"Sciences","Questionner le monde":"Sciences","Découvrir le monde":"Sciences","Physique-chimie":"Physique-chimie","Arts plastiques":"Arts plastiques","Éducation musicale":"Éducation musicale","Langues vivantes":"Langues vivantes","Enseignement moral et civique":"EMC","EPS":"EPS","Se repérer dans l’espace":"Espace"};
const MATDOM={"Mathématiques":"Acquisition des premiers outils mathématiques","Français":"Développement et structuration du langage oral et écrit","Sciences":"Découvrir le monde du vivant, de la matière et des objets","Arts plastiques":"Agir, s’exprimer, comprendre à travers les activités artistiques","Éducation musicale":"Agir, s’exprimer, comprendre à travers les activités artistiques","EPS":"Agir, s’exprimer, comprendre à travers les activités physiques","Espace":"Se repérer dans le temps et l’espace"};
const PEXTRA={"signaletique-cross":["EPS"]};
function progCell(r,l){
  const c4=["5e","4e","3e"].includes(l);
  if(MATL.includes(l))return MATDOM[r]?[MATDOM[r],"M26",1]:null;
  switch(r){
    case "Mathématiques":case "Français":
      if(["CP","CE1","CE2"].includes(l))return [r,"FM24",0];
      if(["CM1","CM2","6e"].includes(l))return [r,"FM25",l==="CM2"];
      if(l==="5e")return [r,"FM26",1];
      return [r,"P20",0];
    case "Sciences":
      if(l==="CP"||l==="CM1")return ["Sciences et technologie","ST26",1];
      if(l==="CE1"||l==="CE2")return ["Questionner le monde","P20",0];
      if(l==="CM2"||l==="6e")return ["Sciences et technologie","P20",0];
      return ["Technologie","T24",l==="3e"];
    case "Espace":return ["CP","CE1","CE2"].includes(l)?["Mathématiques (espace)","FM24",0]:null;
    case "Physique-chimie":return c4?[r,"P20",0]:null;
    case "Arts plastiques":case "Éducation musicale":return [r,"P20",0];
    case "Langues vivantes":
      if(l==="CP"||l==="CM1")return [r,"LV26",1];
      if(l==="6e")return [r,"LV25",0];
      if(l==="5e")return [r,"LV25",1];
      return [r,"P20",0];
    case "EMC":return ["Enseignement moral et civique","EMC24",["CE2","6e","3e"].includes(l)];
    case "EPS":
      if(l==="CP"||l==="CM1")return ["Éducation physique et sportive","EH26",1];
      return ["Éducation physique et sportive","P20",0];
  }
  return null;
}
function progBlock(p){
  const lv=levels(p.niv);if(!lv.length)return "";
  const rows=[];[...(D[p.id]?.notions||[]).map(n=>n[0]),...(PEXTRA[p.id]||[])].forEach(d=>{const r=PROW[d];if(r&&!rows.includes(r))rows.push(r)});
  if(!rows.length)return "";
  const order=["Mathématiques","Espace","Français","Sciences","Physique-chimie","Arts plastiques","Éducation musicale","Langues vivantes","EMC","EPS"];
  rows.sort((a,b)=>order.indexOf(a)-order.indexOf(b));
  const body=rows.map(r=>{const cells=lv.map(l=>progCell(r,l));if(cells.every(c=>!c))return "";
    return `<tr><td class="disc">${r==="Sciences"?"Sciences, technologie":r==="Espace"?"Espace":r}</td>${cells.map(c=>c?`<td>${c[0]!==r?`<span class="pn">${c[0]}</span>`:""}<a href="${BO[c[1]].u}" target="_blank" rel="noopener">${BO[c[1]].b}</a>${c[2]?`<span class="new">nouveau en 2026-2027</span>`:""}</td>`:`<td class="moment">—</td>`).join("")}</tr>`}).join("");
  if(!body)return "";
  return `<div class="box prof progbox"><h3>Programmes applicables en 2026-2027</h3><p class="regards" style="margin:4px 0 10px">Le texte en vigueur dépend du niveau : certaines classes changent de programme cette année, d’autres l’année prochaine. Repères vérifiés au Bulletin officiel le 1er octobre 2026.</p><div class="ntable"><table><thead><tr><th>Discipline</th>${lv.map(l=>`<th>${l}</th>`).join("")}</tr></thead><tbody>${body}</tbody></table></div></div>`;
}

/* ---------- Rendu fiche projet ---------- */
function renderProject(p){
  const i=P.indexOf(p),prev=P[i-1],next=P[i+1];
  const v=document.getElementById("v-projet");
  v.innerHTML=`
  <nav class="crumb" aria-label="Fil d’Ariane"><a href="#accueil">Projets</a><span>›</span><span>${CYCLES[p.cycle]}</span></nav>
  <div class="phead">
    <div>
      <p class="eyebrow">${p.niv} · ${CYCLES[p.cycle]}${p.moment!=="Toute l’année"?" · "+p.moment:""}</p>
      <h1 style="margin-top:8px">${p.titre}</h1>
      <p style="font-size:1.15rem;color:var(--muted);margin-top:12px">${p.accroche}</p>${p.source?`<p class="src">Inspiré de : ${p.source.map(x=>`<a href="${x.u}" target="_blank" rel="noopener">${x.t}</a>`).join(" · ")}</p>`:""}
      <dl class="facts">
        <div><dt>Durée</dt><dd>${p.duree}</dd></div>
        <div><dt>Groupes</dt><dd>${p.groupe}</dd></div>
        <div><dt>Machine</dt><dd>${p.machine}</dd></div>
        <div><dt>Difficulté</dt><dd>${p.diff}</dd></div>
      </dl>
      <div class="defi"><span class="eyebrow">Le défi, à dire aux élèves</span><p>« ${p.defi} »</p></div>
    </div>
    <div class="art">${p.hero}</div>
  </div>
  <div class="toolbar">
    <div class="mode" role="group" aria-label="Affichage"><button data-m="prof" aria-pressed="true">Vue enseignant</button><button data-m="eleve" aria-pressed="false">Vue élève, à projeter</button></div>
    <small>La vue élève masque la préparation, le déroulé et l’évaluation.</small>
  </div>
  ${PDFS[p.id]?`<div class="dl"><a class="btn primary" href="pdf/${PDFS[p.id].e}" target="_blank" rel="noopener">Fiche PDF enseignant</a><a class="btn ghost" href="pdf/${PDFS[p.id].s}" target="_blank" rel="noopener">Fiche PDF élève</a></div>`:""}

  ${noteBlock(p)}

  ${didacBlock(p)}

  <div class="two prof">
    <div class="box"><h3>Ce que les élèves apprennent</h3><ul class="clean learn">${p.apprend.map(a=>`<li>${a}</li>`).join("")}</ul><p class="prog">${p.prog}</p></div>
    <div class="box"><h3>Matériel par groupe</h3><table class="mat">${p.mat.map(m=>`<tr><td>${m[0]}</td><td>${m[1]}</td></tr>`).join("")}</table></div>
  </div>

  ${progBlock(p)}

  <div class="box prof"><h3>À préparer avant la séance</h3><ul class="clean check">${p.prep.map(a=>`<li>${a}</li>`).join("")}</ul></div>

  <div class="sec prof"><header><p class="eyebrow">Déroulé</p><h2>Séance par séance</h2></header>
    <div class="seances">${p.seances.map(s=>`<div class="box seance"><h4>${s.t}<span>${s.d}</span></h4><div class="timeline">${s.ph.map(f=>`<div><b>${f[0]}</b><span>${f[1]}</span></div>`).join("")}</div></div>`).join("")}</div>
  </div>

  <div class="sec"><header><p class="eyebrow">Fabrication</p><h2>Les étapes, une par une</h2><p class="techres prof" style="margin-top:8px"><b>Ressource technique · </b>dans une démarche de projet, ces étapes ne sont pas données au départ. Elles servent après la phase d’idées, au groupe qui a besoin d’un geste précis.</p></header>
    <div class="steps">${p.etapes.map((e,k)=>`<article class="step"><div class="txt"><h4><span class="num">${k+1}</span>${e.t}</h4><p>${e.x}</p>${e.say?`<p class="say prof">À demander : ${e.say}</p>`:""}${e.tip?`<p class="tip"><b>Astuce · </b>${e.tip}</p>`:""}</div><div class="fig">${e.code?`<pre class="code">${e.code}</pre>`:e.svg}</div></article>`).join("")}</div>
  </div>

  <div class="sec"><header><p class="eyebrow">Tester</p><h2>Le protocole et le tableau de résultats</h2></header>
    <p style="max-width:48em">${p.test.p}</p>
    <div class="restable"><table><thead><tr>${p.test.cols.map(c=>`<th>${c}</th>`).join("")}</tr></thead><tbody><tr>${p.test.ex.map(c=>`<td class="ex">${c}</td>`).join("")}</tr>${"<tr>"+p.test.cols.map(()=>"<td></td>").join("")+"</tr>"}${"<tr>"+p.test.cols.map(()=>"<td></td>").join("")+"</tr>"}</tbody></table></div>
    <small style="color:var(--muted)">La première ligne, en italique, est un exemple.</small>
  </div>

  <div class="sec"><header><p class="eyebrow">Dépanner</p><h2>Si ça ne marche pas</h2></header>
    <div class="pannes">${p.pannes.map(x=>`<div class="panne"><b>${x[0]}</b><span>${x[1]}</span></div>`).join("")}</div>
  </div>

  <div class="two">
    <div class="box"><h3>Défis pour aller plus loin</h3><ul class="clean learn">${p.plus.map(a=>`<li>${a}</li>`).join("")}</ul></div>
    <div class="fablabup"><span class="eyebrow">Version FabLab, avec les machines</span><ul>${p.fablab.map(a=>`<li>${a}</li>`).join("")}</ul></div>
  </div>

  <div class="sec prof"><header><p class="eyebrow">Évaluer</p><h2>Grille d’observation</h2></header>
    <div class="grid-eval"><table><thead><tr><th>Critère</th><th>Pas encore</th><th>En cours</th><th>Réussi</th></tr></thead><tbody>${p.eval.map(r=>`<tr>${r.map((c,j)=>j?`<td>${c}</td>`:`<th>${c}</th>`).join("")}</tr>`).join("")}</tbody></table></div>
    <p class="regards"><b>Quatre regards pour évaluer · </b>l’élève s’auto-évalue (son objet répond-il au défi ?) ; les camarades comparent les objets avec les critères ; l’enseignant observe les choix techniques (étapes prévues, difficultés anticipées) et la maîtrise des gestes.</p>
  </div>

  <div class="safety"><h3>Sécurité</h3><ul class="clean learn">${p.secu.map(a=>`<li>${a}</li>`).join("")}</ul></div>

  <nav class="nextprev" aria-label="Autres projets">${prev?`<a class="btn ghost" href="#${prev.id}">← ${prev.titre}</a>`:"<span></span>"}${next?`<a class="btn ghost" href="#${next.id}">${next.titre} →</a>`:`<a class="btn ghost" href="#accueil">Tous les projets</a>`}</nav>`;
  v.querySelectorAll(".mode button").forEach(b=>b.addEventListener("click",()=>{
    v.querySelectorAll(".mode button").forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));
    document.body.classList.toggle("eleve",b.dataset.m==="eleve");
  }));
}

/* ---------- Méthode ---------- */
const PH=[["Le défi","Une phrase, un critère mesurable, des contraintes de matériel.","« Votre objet devra… On saura qu’il réussit si… »"],["Les idées","Chercher seul puis en groupe. Dessiner au moins deux idées avant de fabriquer.","« Montre-moi deux idées différentes. »"],["Le prototype","Fabriquer vite, en carton ou en papier. Il a le droit d’être moche.","« Ce n’est pas l’objet final, c’est un essai. »"],["Le test","Même protocole pour tous, résultat mesuré et noté.","« Qu’est-ce que tu as mesuré ? Combien ? »"],["L’amélioration","Changer une chose, retester, comparer.","« Qu’as-tu changé ? Est-ce mieux ? Comment le sais-tu ? »"],["Le partage","Photo, tableau, explication orale. La machine arrive ici si elle apporte de la précision.","« Qu’est-ce qu’un autre groupe peut apprendre de ton objet ? »"]];
(function(){
  const cx=170,cy=130,R=80;let s=`<circle class="o dash" cx="${cx}" cy="${cy}" r="${R}"/>`;
  PH.forEach((ph,k)=>{const a=-Math.PI/2+k*2*Math.PI/6;const x=cx+R*Math.cos(a),y=cy+R*Math.sin(a);
    const a2=a+Math.PI/6,b1=a2-0.1,b2=a2+0.1;s+=arr(cx+R*Math.cos(b1),cy+R*Math.sin(b1),+(cx+R*Math.cos(b2)).toFixed(1),+(cy+R*Math.sin(b2)).toFixed(1));
    s+=`<circle class="af" cx="${x}" cy="${y}" r="20"/><text x="${x}" y="${y+6}" text-anchor="middle" style="font-family:var(--f-display);font-weight:800;font-size:17px;fill:var(--mat-ink)">${k+1}</text>`;
    const c=Math.cos(a),sn=Math.sin(a),anc=c>0.3?"start":c<-0.3?"end":"middle";
    const lx=x+(anc==="start"?28:anc==="end"?-28:0),ly=y+(anc==="middle"?(sn<0?-28:38):5);
    s+=`<text class="l" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${anc}" style="font-size:13px">${ph[0]}</text>`;
  });
  s+=`<path class="a" d="M${cx+30} ${cy+30} q-30 22 -60 0"/><text class="t" x="${cx}" y="${cy-2}" text-anchor="middle">tester,</text><text class="t" x="${cx}" y="${cy+12}" text-anchor="middle">améliorer,</text><text class="t" x="${cx}" y="${cy+26}" text-anchor="middle">recommencer</text>`;
  document.getElementById("cycle-svg").innerHTML=S(s,"-50 0 440 262");
  const PD=[
   {n:"Le défi",d:"5 à 10 min",g:"Poser un problème que les élèves ont envie de résoudre, et dont on pourra mesurer la réussite.",
    e:"Énonce le défi en une phrase, montre le matériel et les contraintes, annonce comment on saura que c’est réussi. Ne montre aucune solution.",
    l:"Reformulent le défi avec leurs mots, posent leurs questions sur les règles.",
    t:"Le défi et le critère de réussite écrits au tableau.",
    a:"Montrer un modèle fini dès le départ : toute la classe le copie et ne cherche plus.",
    x:"« Fabrique une toupie qui tourne le plus longtemps possible. On mesurera au chronomètre. »"},
   {n:"Les idées",d:"10 min",g:"Faire anticiper avant de fabriquer : l’élève sait ce qu’il veut essayer, et pourquoi.",
    e:"Demande au moins deux idées dessinées par groupe. Fait expliquer chaque idée. Ne valide pas et ne corrige pas encore.",
    l:"Dessinent, annotent, comparent dans le groupe, choisissent l’idée à essayer en premier.",
    t:"Croquis légendé (dictée à l’adulte en maternelle).",
    a:"Passer directement au matériel : les élèves bricolent sans intention et ne savent pas expliquer ce qu’ils font.",
    x:"Un groupe dessine un petit disque, un autre un grand disque avec l’axe bien au centre."},
   {n:"Le prototype",d:"15 à 25 min",g:"Rendre l’idée réelle rapidement, avec des matériaux simples, pour pouvoir la tester.",
    e:"Circule et questionne. Prend en charge les gestes dangereux. Rappelle que ce n’est pas l’objet final.",
    l:"Fabriquent, ajustent, s’entraident. Photographient leur prototype.",
    t:"Photo du prototype.",
    a:"Chercher la perfection ou la décoration dès le premier essai : le temps manque ensuite pour tester.",
    x:"Disque de 8 cm découpé dans du carton, cure-dents planté au centre."},
   {n:"Le test",d:"10 min",g:"Savoir de façon objective si l’objet fonctionne et à quel point.",
    e:"Impose le même protocole pour tous : mêmes conditions, plusieurs essais. Fait noter chaque résultat.",
    l:"Mesurent, notent dans le tableau, observent ce qui se passe pendant l’essai.",
    t:"Tableau de résultats.",
    a:"Se contenter de « ça marche » ou « ça ne marche pas » : sans mesure, on ne peut pas comparer.",
    x:"Trois lancers sur la même assiette, on garde le temps du milieu : 9 secondes."},
   {n:"L’amélioration",d:"10 à 20 min, plusieurs fois",g:"Comprendre ce qui fait fonctionner l’objet en le modifiant de façon raisonnée.",
    e:"Demande « Que vas-tu changer, et pourquoi ? ». Impose de ne changer qu’une seule chose entre deux tests.",
    l:"Formulent une hypothèse, modifient, testent de nouveau, comparent avec le premier résultat.",
    t:"Une ligne du tableau : ce que j’ai changé, le nouveau résultat.",
    a:"Tout changer d’un coup : on ne sait plus ce qui a amélioré l’objet.",
    x:"Le groupe passe à un disque de 10 cm, sans rien changer d’autre : 14 secondes. Le diamètre compte."},
   {n:"Le partage",d:"10 min",g:"Transformer l’expérience en savoir que l’on peut réutiliser.",
    e:"Met en commun les résultats de la classe, fait formuler la règle, rédige la trace écrite avec les élèves. Présente la machine si elle apporte de la précision.",
    l:"Présentent leur objet, expliquent ce qui a marché et pourquoi, recopient la trace écrite.",
    t:"Trace écrite dans le cahier de la discipline, photo de l’objet.",
    a:"S’arrêter à l’objet fini sans formuler ce que l’on a appris : l’activité reste une activité manuelle.",
    x:"« Pour savoir ce qui améliore la toupie, on ne change qu’une chose à la fois. Le centre doit être exact. »"}];
  document.getElementById("phasecards").innerHTML=PD.map((p,k)=>`<article class="pc"><div class="side"><span class="n">${k+1}</span><h3>${p.n}</h3><span class="dur">${p.d}</span><p class="goal">${p.g}</p></div><div class="main"><div><h4>L’enseignant</h4><p>${p.e}</p></div><div><h4>Les élèves</h4><p>${p.l}</p></div><div><h4>La trace</h4><p>${p.t}</p></div><div class="avoid"><h4>À éviter</h4><p>${p.a}</p></div><div class="ex"><h4>Exemple · la toupie, CE1</h4><p>${p.x}</p></div></div></article>`).join("");
})();

/* ---------- Routeur ---------- */
/* ---------- Projets & créativité : rendu ---------- */
const SPALL=[...SPF_A,...SPF_B,...SP_A,...SP_B].sort((a,b)=>a.cycles[0].localeCompare(b.cycles[0])||((b.full?1:0)-(a.full?1:0))||LV.indexOf(levels(a.niv)[0])-LV.indexOf(levels(b.niv)[0]));
const SPMAP=Object.fromEntries(SPALL.map(s=>[s.id,s]));
const NOTES=Object.assign({},NOTES_A,NOTES_B);
const SP_BY_P={};SPALL.forEach(s=>(s.liens||[]).forEach(id=>{(SP_BY_P[id]=SP_BY_P[id]||[]).push(s.id)}));
const TOOLMAP=Object.fromEntries(CR_TOOLS.map(t=>[t.id,t]));
const CYCN={"1":"Cycle 1","2":"Cycle 2","3":"Cycle 3","4":"Cycle 4"};
const CR_PAGES=[["creativite","La rubrique"],["cr-demarche","La démarche"],["cr-progression","Progression C1 → C4"],["cr-banque","Banque de situations"],["cr-outils","Boîte à outils"],["cr-prototyper","Prototyper et tester"],["cr-accompagner","Accompagner"],["cr-probleme","Du problème au projet"]];
function crSub(cur){return `<nav class="crsub" aria-label="Rubrique Projets & créativité">${CR_PAGES.map(([h,l])=>`<a href="#${h}"${h===cur?' aria-current="page"':""}>${l}</a>`).join("")}</nav>`}
const spLink=id=>SPMAP[id]?`<a href="#${id}">${SPMAP[id].titre}</a>`:"";
function spTags(s){return `<span class="tag cyc">${s.niv}</span><span class="tag">${CR_DUREES[s.duree]}</span><span class="tag ouv-${s.ouv}">${CR_OUVS[s.ouv]}</span><span class="tag">${CR_DEMS[s.demarche]}</span>${s.mat.filter(m=>!["sans","simple"].includes(m)).map(m=>`<span class="tag mach">${CR_MATS[m]}</span>`).join("")}${s.mat.includes("sans")?`<span class="tag tx">Sans machine</span>`:""}`}
function spCard(s){return `<a class="scard${s.full?" full":""}" href="#${s.id}">${s.full?`<span class="tag full" style="align-self:flex-start">Fiche détaillée</span>`:""}<h3>${s.titre}</h3><p class="q">${s.question}</p><div class="meta">${spTags(s)}</div></a>`}
function projMini(id){const p=P.find(x=>x.id===id);if(!p)return "";return `<a href="#${p.id}"><div class="mini">${p.hero}</div><span>${p.titre}<small>${p.niv} · fiche technique</small></span></a>`}
function ul(a,cls="clean learn"){return `<ul class="${cls}">${a.map(x=>`<li>${x}</li>`).join("")}</ul>`}

/* Schéma de la démarche */
function flowSVG(){
  const W=960,pos=[[85,52],[282,52],[480,52],[677,52],[875,52],[875,178],[677,178],[480,178],[282,178],[85,178]];
  const st=(k)=>k===6?"fill:var(--card);stroke:var(--cut)":k===9?"fill:var(--mat);stroke:var(--mat)":"fill:var(--card);stroke:var(--mat)";
  const tc=(k)=>k===6?"var(--cut)":k===9?"var(--mat-ink)":"var(--ink)";
  let s="";
  const ar=(x1,y1,x2,y2,dash)=>{const a=Math.atan2(y2-y1,x2-x1),h=9;return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:var(--mat);stroke-width:2.5${dash?";stroke-dasharray:6 5":""}"/><polyline points="${(x2-h*Math.cos(a-.5)).toFixed(1)},${(y2-h*Math.sin(a-.5)).toFixed(1)} ${x2},${y2} ${(x2-h*Math.cos(a+.5)).toFixed(1)},${(y2-h*Math.sin(a+.5)).toFixed(1)}" style="fill:none;stroke:var(--mat);stroke-width:2.5"/>`};
  for(let k=0;k<4;k++)s+=ar(pos[k][0]+80,52,pos[k+1][0]-80,52);
  s+=ar(875,76,875,154);
  for(let k=5;k<9;k++)s+=ar(pos[k][0]-80,178,pos[k+1][0]+80,178);
  s+=`<path d="M282 202 C 282 246, 875 246, 875 204" style="fill:none;stroke:var(--mat);stroke-width:2.5;stroke-dasharray:6 5"/><polyline points="867,214 875,203 883,214" style="fill:none;stroke:var(--mat);stroke-width:2.5"/><text x="578" y="268" text-anchor="middle" style="font:600 15px var(--f-mono);fill:var(--mat)">on reteste, autant de fois que nécessaire</text>`;
  pos.forEach(([x,y],k)=>{s+=`<rect x="${x-78}" y="${y-24}" width="156" height="48" rx="24" style="${st(k)};stroke-width:2.5"/><text x="${x}" y="${y+6}" text-anchor="middle" style="font:700 ${CR_FLOW[k][0].length>12?16:17}px var(--f-body);fill:${tc(k)}">${CR_FLOW[k][0]}</text>`});
  return `<svg viewBox="0 0 ${W} 280" role="img" aria-label="La démarche : besoin, problème, idées, choix, prototype, test, erreur, amélioration, nouvelle version, solution">${s}</svg>`;
}
const flowPills=()=>`<div class="flow" aria-hidden="true">${CR_FLOW.map((f,k)=>`<span class="${k===6?"err":k===9?"end":""}">${f[0]}</span>${k<9?"<i>→</i>":""}`).join("")}</div>`;

/* ---- Page d’accueil de la rubrique ---- */
function crHome(){
  const nC=c=>SPALL.filter(s=>s.cycles.includes(c)).length,nT=t=>SPALL.filter(s=>s.theme.includes(t)).length;
  return `${crSub("creativite")}
  <div class="crhero"><div><p class="eyebrow">Projets & créativité</p><h1 style="margin-top:10px">Partir d’un problème, pas d’un objet</h1>
  <p class="lead">Un problème existe, les élèves imaginent des solutions, ils en fabriquent une, la testent et l’améliorent. Cette rubrique vous donne la démarche, des situations-problèmes prêtes à l’emploi, des outils pour faire naître les idées et des repères pour accompagner sans donner la réponse.</p>
  <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:22px"><a class="btn primary" href="#cr-banque">Trouver une situation-problème</a><a class="btn ghost" href="#cr-demarche">Comprendre la démarche</a></div></div>
  <div class="shift"><div class="from"><span class="eyebrow">D’une logique</span><p>« Je sais utiliser une machine pour fabriquer un objet. »</p></div><div class="arrow">→</div><div class="to"><span class="eyebrow">Vers une logique</span><p>« Je rencontre un problème, j’imagine différentes solutions et j’utilise les ressources du FabLab pour en expérimenter une. »</p></div></div></div>
  <div class="sec"><header><p class="eyebrow">Le fil conducteur</p><h2>Observer, imaginer, tester, se tromper, améliorer, expliquer</h2></header><div class="flowsvg">${flowSVG()}</div>${flowPills()}</div>
  <div class="sec"><header><p class="eyebrow">Je cherche…</p><h2>Les espaces de la rubrique</h2></header><div class="entries">
   <a class="entry" href="#cr-demarche"><span class="ico">${crIco("loop")}</span><b>Découvrir la démarche</b><span>Du besoin à la solution, en dix mots puis en treize étapes, avec ce que font l’élève et l’enseignant.</span></a>
   <a class="entry" href="#cr-progression"><span class="ico">${crIco("stairs")}</span><b>La progression du cycle 1 au cycle 4</b><span>Imaginer et essayer, puis concevoir et argumenter : ce que l’élève apprend à faire à chaque cycle.</span></a>
   <a class="entry" href="#cr-banque"><span class="ico">${crIco("grid")}</span><b>La banque de situations-problèmes</b><span>${SPALL.length} situations tirées de la vie de la classe et de l’établissement, filtrables par cycle, thème, durée, matériel.</span></a>
   <a class="entry" href="#cr-outils"><span class="ico">${crIco("box")}</span><b>La boîte à outils de la créativité</b><span>${CR_TOOLS.length} techniques simples pour faire produire plusieurs idées aux élèves.</span></a>
   <a class="entry" href="#cr-prototyper"><span class="ico">${crIco("flask")}</span><b>Prototyper et tester</b><span>Organiser les essais, faire de l’erreur une information, choisir le bon outil du FabLab.</span></a>
   <a class="entry" href="#cr-accompagner"><span class="ico">${crIco("chat")}</span><b>Accompagner sans donner la solution</b><span>Questions de relance, phrases à éviter, gradation de l’aide, gestion des blocages.</span></a>
   <a class="entry" href="#cr-probleme"><span class="ico">${crIco("target")}</span><b>Du problème au projet</b><span>Transformer une situation de votre classe en projet FabLab, avec une grille et une fiche de cadrage.</span></a>
  </div></div>
  <div class="sec"><header><p class="eyebrow">Entrer par cycle</p><h2>Une créativité qui grandit avec l’élève</h2></header><div class="cyc4">${CR_PROG.map(c=>`<a href="#cr-banque?c=${c.c}"><span class="eyebrow">${CYCN[c.c]} · ${CYCLES[c.c].split("· ")[1]}</span><b>${c.motto}</b><span class="n">${nC(c.c)} situations →</span></a>`).join("")}</div></div>
  <div class="sec"><header><p class="eyebrow">Entrer par thème</p><h2>Les problèmes de la vie de l’école</h2></header><div class="themes">${Object.entries(CR_THEMES).map(([k,v])=>`<a href="#cr-banque?t=${k}"><b>${v[0]}</b><span>${v[1]}</span><em>${nT(k)} situations</em></a>`).join("")}</div></div>
  <div class="sec"><header><p class="eyebrow">Entrer par contrainte</p><h2>Selon votre temps et votre matériel</h2></header>
   <div class="bfrow"><span class="lab">Durée</span><div class="quick">${Object.entries(CR_DUREES).map(([k,v])=>`<a class="chip" href="#cr-banque?du=${k}">${v}</a>`).join("")}</div></div>
   <div class="bfrow"><span class="lab">Matériel</span><div class="quick">${Object.entries(CR_MATS).map(([k,v])=>`<a class="chip" href="#cr-banque?m=${k}">${v}</a>`).join("")}</div></div>
   <div class="bfrow"><span class="lab">Démarche</span><div class="quick">${Object.entries(CR_DEMS).map(([k,v])=>`<a class="chip" href="#cr-banque?dm=${k}">${v}</a>`).join("")}</div></div>
  </div>
  <div class="sec"><header><p class="eyebrow">Prêtes à l’emploi</p><h2>Les fiches détaillées</h2><p style="color:var(--muted);max-width:46em;margin-top:6px">Situation, problématique, ce qu’il ne faut pas donner, phase de créativité, prototypes, tests, séances, trois regards, liens avec les programmes, différenciation.</p></header><div class="scards">${SPALL.filter(s=>s.full).map(spCard).join("")}</div></div>
  <div class="example"><p class="eyebrow">Et les projets déjà présents sur le site ?</p><p>Ils sont conservés. Chaque fiche projet commence maintenant par une note enseignant « Comment aborder ce projet ? » qui propose d’entrer par un problème, et une variante « Et si on partait plutôt d’un problème ? ». Les étapes de fabrication dessinées deviennent une ressource technique, à utiliser après la phase d’idées. <a href="#projets">Voir les projets</a></p></div>`;
}

/* ---- La démarche ---- */
function crDemarche(){
  return `${crSub("cr-demarche")}
  <div><p class="eyebrow">Découvrir la démarche</p><h1 style="margin-top:10px">Du besoin à la solution</h1><p style="font-size:1.15rem;color:var(--muted);margin-top:14px;max-width:44em">On ne commence pas par l’objet. On commence par quelqu’un qui est gêné, une question, une contrainte. L’objet apparaît peu à peu comme une réponse possible, et la première réponse n’est presque jamais la bonne.</p></div>
  <div class="flowsvg">${flowSVG()}</div>${flowPills()}
  <div class="cards2">${CR_FLOW.map((f,k)=>`<div><h3>${k+1}. ${f[0]}</h3><p>${f[1]}</p><p class="say" style="margin-top:6px">« ${f[2]} »</p></div>`).join("")}</div>
  <div class="sec"><header><p class="eyebrow">En classe</p><h2>Treize étapes, cinq temps</h2><p style="color:var(--muted);max-width:46em;margin-top:6px">Observer → comprendre → questionner → imaginer → comparer → choisir → concevoir → fabriquer → tester → analyser → modifier → retester → présenter. Pour chaque étape : ce que fait l’élève, ce que fait l’enseignant, une phrase de relance.</p></header>
   <div class="temps">${CR_TEMPS.map(t=>`<div><h3>${t.t}</h3>${t.s.map(s=>`<div class="st"><b>${s[0]}</b><span>${s[1]}</span><span style="display:block;color:var(--muted);font-size:.86rem;margin-top:4px">${s[2]}</span><em>${s[3]}</em></div>`).join("")}</div>`).join("")}</div></div>
  <div class="sec"><header><p class="eyebrow">Le cœur de la démarche</p><h2>L’itération : l’erreur devient une information</h2></header>
   <div class="iter"><div><span class="eyebrow">Idée choisie</span><p>Un croquis légendé, un principe.</p></div><div><span class="eyebrow">Prototype 1</span><p>Rapide, en carton. Il a le droit d’être imparfait.</p></div><div class="bad"><span class="eyebrow">Test : ça ne marche pas comme prévu</span><p>On décrit le symptôme, on localise, on cherche pourquoi.</p></div><div><span class="eyebrow">Prototype 2, nouveau test</span><p>Une modification ciblée, le même protocole, on compare.</p></div></div>
   <p style="max-width:48em">Prévoyez toujours le temps d’au moins deux versions. Un projet qui s’arrête au prototype 1 prive les élèves de l’essentiel : comprendre pourquoi ça n’a pas marché et le corriger. Voir <a href="#cr-prototyper">Prototyper et tester</a>.</p></div>
  <div class="do-dont"><div class="yes"><h3>Ce que l’on cherche</h3>${ul(["Plusieurs solutions différentes dans la classe","Des élèves qui expliquent leurs choix","Des versions successives, documentées","Un test qui dit si le besoin est satisfait","Le FabLab au service d’une idée d’élève"])}</div><div><h3>Ce que l’on évite</h3>${ul(["Un objet à reproduire à l’identique","La gamme de fabrication donnée au départ","Une machine utilisée pour elle-même","Un seul essai, déclaré réussi","L’adulte qui répare le prototype"])}</div></div>
  <div class="example"><p class="eyebrow">Et les fiches de fabrication ?</p><p>Reproduire un objet garde une place : pour apprendre un geste technique précis (coudre, plier, câbler un circuit). Dans un projet, ces gestes arrivent au moment où un groupe en a besoin. Les étapes dessinées des <a href="#projets">projets du site</a> jouent ce rôle de ressource technique. La page <a href="#methode">La méthode</a> en donne la version courte, en six phases.</p></div>`;
}

/* ---- Progression ---- */
function crProgression(){
  return `${crSub("cr-progression")}
  <div><p class="eyebrow">Progression</p><h1 style="margin-top:10px">Du cycle 1 au cycle 4, une créativité qui se construit</h1><p style="font-size:1.15rem;color:var(--muted);margin-top:14px;max-width:44em">La créativité ne se travaille pas de la même façon à 4 ans et à 14 ans. D’un cycle à l’autre, les élèves gagnent en autonomie : de l’essai libre à la démarche de conception argumentée.</p></div>
  <div class="stairs" aria-hidden="true">${CR_PROG.map((c,k)=>`<div style="height:${60+k*36}px"><span>${CYCN[c.c]}</span>${c.court}</div>`).join("")}</div>
  <div class="prog4">${CR_PROG.map(c=>`<div><span class="eyebrow">${CYCLES[c.c]}</span><p class="motto">${c.motto}</p><h4>L’élève apprend à</h4>${ul(c.sait,"")}<h4>L’enseignant</h4>${ul(c.ens,"")}<h4>Traces</h4>${ul(c.trace,"")}<h4>Durée et ouverture</h4><p style="font-size:.92rem">${c.duree}. ${c.ouv}.</p><h4>Pour commencer</h4><div style="display:flex;flex-direction:column;gap:4px;font-size:.92rem">${c.ex.map(spLink).join("")}</div><a class="btn ghost" style="margin-top:auto;justify-content:center" href="#cr-banque?c=${c.c}">Toutes les situations</a></div>`).join("")}</div>
  <div class="sec"><header><p class="eyebrow">Repères</p><h2>Chaque compétence de conception, cycle par cycle</h2></header><div class="dtable"><table><thead><tr><th></th>${CR_PROG.map(c=>`<th>${CYCN[c.c]}</th>`).join("")}</tr></thead><tbody>${CR_SKILLS.map(r=>`<tr><th>${r[0]}</th>${r.slice(1).map(x=>`<td>${x}</td>`).join("")}</tr>`).join("")}</tbody></table></div></div>
  <div class="sec"><header><p class="eyebrow">Textes officiels</p><h2>Ce que disent les programmes</h2><p style="color:var(--muted);max-width:46em;margin-top:6px">Citations exactes des programmes en vigueur en 2026-2027. Chaque fiche détaillée précise ensuite pourquoi la compétence est réellement travaillée.</p></header><div class="ptable"><table><thead><tr><th>Niveau</th><th>Ce que dit le programme</th><th>Texte</th></tr></thead><tbody>${CR_OFFICIEL.map(r=>`<tr><td class="disc" style="font-weight:700;white-space:nowrap">${r[0]}</td><td>${r[1]}</td><td><a href="${BO[r[2]].u}" target="_blank" rel="noopener">${BO[r[2]].b}</a></td></tr>`).join("")}</tbody></table></div></div>`;
}

/* ---- Banque ---- */
const BF={c:"all",t:"all",du:"all",m:"all",dm:"all",o:"all",d:"all",q:""};
function crBanque(qs){
  Object.keys(BF).forEach(k=>BF[k]=k==="q"?"":"all");
  new URLSearchParams(qs||"").forEach((v,k)=>{if(k in BF)BF[k]=v});
  const sel=(k,lab,obj)=>`<label>${lab}<select data-k="${k}"><option value="all">Tous</option>${Object.entries(obj).map(([v,l])=>`<option value="${v}"${BF[k]===v?" selected":""}>${Array.isArray(l)?l[0]:l}</option>`).join("")}</select></label>`;
  const chips=(k,obj)=>`<button class="chip" data-k="${k}" data-v="all" aria-pressed="${BF[k]==="all"}">Tous</button>${Object.entries(obj).map(([v,l])=>`<button class="chip" data-k="${k}" data-v="${v}" aria-pressed="${BF[k]===v}">${l}</button>`).join("")}`;
  return `${crSub("cr-banque")}
  <div><p class="eyebrow">Banque de situations-problèmes</p><h1 style="margin-top:10px">Choisir une situation de départ</h1><p style="font-size:1.15rem;color:var(--muted);margin-top:14px;max-width:44em">Chaque situation part d’un problème réel de la classe, de l’école ou du collège. Les fiches détaillées sont encadrées en vert ; les autres donnent l’essentiel pour démarrer.</p></div>
  <div class="bfilters" id="bfilters">
   <div class="bfrow"><span class="lab">Cycle</span>${chips("c",{"1":"Cycle 1","2":"Cycle 2","3":"Cycle 3","4":"Cycle 4"})}</div>
   <div class="bfrow"><span class="lab">Ouverture</span>${chips("o",CR_OUVS)}</div>
   <div class="bfsel">${sel("t","Thème",CR_THEMES)}${sel("du","Durée",CR_DUREES)}${sel("m","Matériel",CR_MATS)}${sel("dm","Type de démarche",CR_DEMS)}${sel("d","Discipline",GLABEL)}<label>Rechercher<input type="search" id="bq" value="${BF.q}" placeholder="bruit, eau, cantine…"></label></div>
  </div>
  <div class="bcount"><b id="bcount"></b><button class="linkbtn" id="breset">Tout effacer</button></div>
  <div class="scards" id="bcards"></div>
  <p id="bnores" class="eyebrow" hidden>Aucune situation pour ces critères. Retirez un filtre.</p>
  <details class="pistes"><summary>Que veulent dire les niveaux d’ouverture et les types de démarche ?</summary><div class="two" style="margin-top:10px"><div>${ul(Object.entries(CR_OUVS).map(([k,v])=>`<b>${v}</b> : ${CR_OUVS_TXT[k]}`))}</div><div>${ul(Object.entries(CR_DEMS).map(([k,v])=>`<b>${v}</b> : ${CR_DEMS_TXT[k]}`))}</div></div></details>`;
}
function bankApply(){
  const q=BF.q.trim().toLowerCase();
  const list=SPALL.filter(s=>(BF.c==="all"||s.cycles.includes(BF.c))&&(BF.t==="all"||s.theme.includes(BF.t))&&(BF.du==="all"||s.duree===BF.du)&&(BF.m==="all"||s.mat.includes(BF.m))&&(BF.dm==="all"||s.demarche===BF.dm)&&(BF.o==="all"||s.ouv===BF.o)&&(BF.d==="all"||(s.disc||[]).some(x=>GROUPS[BF.d].includes(x)))&&(!q||(s.titre+" "+s.question+" "+s.situation).toLowerCase().includes(q)));
  document.getElementById("bcards").innerHTML=list.map(spCard).join("");
  document.getElementById("bcount").textContent=list.length+(list.length>1?" situations":" situation");
  document.getElementById("bnores").hidden=list.length>0;
  const p=new URLSearchParams();Object.entries(BF).forEach(([k,v])=>{if(v&&v!=="all")p.set(k,v)});
  history.replaceState(null,"","#cr-banque"+(p.toString()?"?"+p:""));
}
function bankBind(){
  const f=document.getElementById("bfilters");
  f.querySelectorAll(".chip").forEach(b=>b.addEventListener("click",()=>{BF[b.dataset.k]=b.dataset.v;f.querySelectorAll(`.chip[data-k="${b.dataset.k}"]`).forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));bankApply()}));
  f.querySelectorAll("select").forEach(s=>s.addEventListener("change",()=>{BF[s.dataset.k]=s.value;bankApply()}));
  document.getElementById("bq").addEventListener("input",e=>{BF.q=e.target.value;bankApply()});
  document.getElementById("breset").addEventListener("click",()=>{location.hash="cr-banque"});
  bankApply();
}

/* ---- Boîte à outils ---- */
function crOutils(){
  return `${crSub("cr-outils")}
  <div><p class="eyebrow">Boîte à outils de la créativité</p><h1 style="margin-top:10px">Faire produire plusieurs idées</h1><p style="font-size:1.15rem;color:var(--muted);margin-top:14px;max-width:44em">Laissés seuls, les élèves s’arrêtent souvent à la première idée, ou à celle du plus rapide. Ces techniques, courtes et sans matériel coûteux, les obligent à chercher plus loin. Choisissez-en une ou deux par projet.</p></div>
  <div class="example"><p class="eyebrow">Trois règles communes</p><p>On cherche seul avant de chercher en groupe. On produit avant de juger. On garde une trace de toutes les idées, même celles qu’on n’a pas choisies.</p></div>
  <div class="tools">${CR_TOOLS.map(t=>`<details class="tool" id="t-${t.id}"><summary><span class="ico">${crIco(t.ico)}</span><span><b>${t.nom}</b><span>${t.quand}</span></span></summary><div class="tbody"><div><p class="eyebrow">Comment faire · ${t.duree}</p><ol>${t.etapes.map(e=>`<li>${e}</li>`).join("")}</ol><p style="margin-top:10px;font-size:.93rem"><b>Matériel :</b> ${t.mat}</p></div><div style="display:flex;flex-direction:column;gap:10px"><div class="adire"><span class="eyebrow">Exemple</span><p>${t.ex}</p></div><div class="trap"><b>Piège à éviter · </b>${t.piege}</div></div><div style="grid-column:1/-1"><p class="eyebrow" style="margin-bottom:6px">Adapter selon le cycle</p><div class="cycrow">${t.adapt.map((a,k)=>`<div><b>Cycle ${k+1}</b>${a}</div>`).join("")}</div><p style="margin-top:10px;font-size:.92rem">Situations qui utilisent cet outil : ${SPALL.filter(s=>(s.full?s.creativite.techniques:s.techniques||[]).includes(t.id)).slice(0,6).map(s=>spLink(s.id)).join(" · ")||"—"}</p></div></div></details>`).join("")}</div>`;
}

/* ---- Prototyper et tester ---- */
function crPrototyper(){
  const P_=CR_PROTO;
  return `${crSub("cr-prototyper")}
  <div><p class="eyebrow">Prototyper et tester</p><h1 style="margin-top:10px">Essayer, se tromper, comprendre, améliorer</h1><p style="font-size:1.15rem;color:var(--muted);margin-top:14px;max-width:44em">Le premier prototype n’a pas à réussir. Il sert à apprendre quelque chose. L’essentiel se joue entre le premier test et la deuxième version.</p></div>
  <div class="sec"><header><p class="eyebrow">Du croquis à la version finale</p><h2>Quatre niveaux de prototype</h2></header><div class="iter">${P_.niveaux.map(n=>`<div><span class="eyebrow">${n[0]}</span><p>${n[1]}</p></div>`).join("")}</div></div>
  <div class="sec"><header><p class="eyebrow">Organiser les essais</p><h2>Six règles pour des tests utiles</h2></header><div class="rules">${P_.regles.map(r=>`<div><b>${r[0]}</b><span>${r[1]}</span></div>`).join("")}</div></div>
  <div class="sec"><header><p class="eyebrow">L’erreur comme information</p><h2>Quand ça ne marche pas : cinq questions</h2></header><div class="ladder">${P_.diag.map((d,k)=>`<div><span class="n">${k+1}</span><div><b>${d[0]}</b><p style="color:var(--muted)">${d[1]}</p></div></div>`).join("")}</div>
  <div class="example"><p class="eyebrow">Une idée pour la classe</p><p>Affichez une « galerie des versions » : chaque prototype raté y figure avec une étiquette « Ce que nous avons appris ». Les élèves voient que l’erreur fait partie du travail, et les autres groupes en profitent.</p></div></div>
  <div class="sec"><header><p class="eyebrow">À imprimer</p><h2>Le carnet des versions</h2><p style="color:var(--muted);max-width:46em;margin-top:6px">Une ligne par version. Au cycle 2, on dessine et on dicte ; à partir du cycle 3, on écrit et on mesure.</p></header><div class="tpl tplwrap"><table><thead><tr><th>Version</th><th>Ce que nous avons changé</th><th>Pourquoi</th><th>Résultat du test</th><th>Ce que nous gardons</th></tr></thead><tbody><tr><td>1</td><td></td><td></td><td></td><td></td></tr><tr><td>2</td><td></td><td></td><td></td><td></td></tr><tr><td>3</td><td></td><td></td><td></td><td></td></tr></tbody></table></div></div>
  <div class="two"><div class="box"><h3>Les critères de réussite selon le cycle</h3><table class="mat">${P_.criteres.map(c=>`<tr><td>${c[0]}</td><td>${c[1]}</td></tr>`).join("")}</table><p style="margin-top:10px;font-size:.93rem;color:var(--muted)">Construisez les critères avec les élèves, avant le premier test. Un critère qu’on ne peut ni voir ni mesurer ne sert pas à décider.</p></div>
  <div class="box"><h3>Le kit de prototypage à presque zéro euro</h3>${ul(P_.kit)}</div></div>
  <div class="sec"><header><p class="eyebrow">Le FabLab au service du projet</p><h2>Quel outil, pour quel besoin ?</h2><p style="color:var(--muted);max-width:46em;margin-top:6px">On ne choisit jamais une machine pour utiliser une machine. Chaque outil répond à un besoin du projet, et presque tous les projets de la banque se réalisent sans machine.</p></header><div class="ptable"><table><thead><tr><th>Le projet a besoin de…</th><th>Outil possible</th><th>Quand et comment</th></tr></thead><tbody>${P_.outils.map(o=>`<tr><td><b>${o[0]}</b></td><td>${o[1]}</td><td class="why">${o[2]}</td></tr>`).join("")}</tbody></table></div><p style="font-size:.93rem">Règles de sécurité par âge : voir <a href="#securite">Sécurité</a>.</p></div>`;
}

/* ---- Accompagner ---- */
function crAccompagner(){
  const A=CR_ACC;
  return `${crSub("cr-accompagner")}
  <div><p class="eyebrow">Accompagner sans donner la solution</p><h1 style="margin-top:10px">Relancer, sans faire à la place</h1><p style="font-size:1.15rem;color:var(--muted);margin-top:14px;max-width:44em">Le plus difficile pour l’enseignant est de ne pas donner la réponse qu’il connaît. Voici des gestes, des questions et une gradation de l’aide pour que les élèves restent les auteurs de leur solution.</p></div>
  <div class="do-dont"><div class="yes"><h3>Ce que fait l’enseignant</h3><ul class="clean learn">${A.faire.map(f=>`<li><b>${f[0]}</b> · ${f[1]}</li>`).join("")}</ul></div><div><h3>Ce qu’il évite</h3><ul class="clean learn">${A.eviter.map(f=>`<li><b>${f[0]}</b> · ${f[1]}</li>`).join("")}</ul></div></div>
  <div class="sec"><header><p class="eyebrow">Dire autrement</p><h2>Phrases à éviter, phrases à préférer</h2></header><div class="say2"><div class="hd">Plutôt que…</div><div class="hd">Essayez…</div>${A.phrases.map(p=>`<div class="no">« ${p[0]} »</div><div class="yes">« ${p[1]} »</div>`).join("")}</div></div>
  <div class="sec"><header><p class="eyebrow">Banque de questions</p><h2>Questions pour faire réfléchir, phase par phase</h2></header><div class="qphases">${A.questions.map(q=>`<div><h3>${q[0]}</h3><ul class="clean learn">${q[1].map(x=>`<li>« ${x} »</li>`).join("")}</ul></div>`).join("")}</div></div>
  <div class="sec"><header><p class="eyebrow">Graduer l’aide</p><h2>Cinq niveaux, du plus léger au plus fort</h2><p style="color:var(--muted);max-width:46em;margin-top:6px">Commencez toujours par le niveau 1. Ne passez au suivant que si le groupe reste bloqué.</p></header><div class="ladder">${A.echelle.map((e,k)=>`<div><span class="n">${k+1}</span><div><b>${e[0]}</b><p style="color:var(--muted)">${e[1]}</p></div></div>`).join("")}</div></div>
  <div class="two"><div class="box"><h3>Des rôles dans le groupe</h3><table class="mat">${A.roles.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join("")}</table><p style="margin-top:10px;font-size:.93rem;color:var(--muted)">Les rôles tournent à chaque séance. Au cycle 1, l’adulte anime un petit groupe et les rôles restent implicites.</p></div>
  <div class="nepas"><h3>Ce qu’il ne faut surtout pas donner au départ</h3><ul class="clean">${A.nepas.map(x=>`<li>${x}</li>`).join("")}</ul><p style="margin-top:10px;font-size:.93rem">Chaque fiche de la banque précise ce point pour sa situation.</p></div></div>
  <div class="sec"><header><p class="eyebrow">Situations délicates</p><h2>Quand ça bloque</h2></header><div class="pannes">${A.blocages.map(b=>`<div class="panne"><b>${b[0]}</b><span>${b[1]}</span></div>`).join("")}</div></div>`;
}

/* ---- Du problème au projet ---- */
function crProbleme(){
  const B=CR_PB;
  return `${crSub("cr-probleme")}
  <div><p class="eyebrow">Du problème au projet</p><h1 style="margin-top:10px">Votre classe est pleine de projets</h1><p style="font-size:1.15rem;color:var(--muted);margin-top:14px;max-width:44em">Les crayons qui tombent, le bruit de la cantine, les manteaux par terre : chaque petit problème quotidien peut devenir un projet où les élèves conçoivent une vraie solution pour de vrais utilisateurs.</p></div>
  <div class="sec"><header><p class="eyebrow">La méthode</p><h2>Cinq étapes pour transformer une situation en projet</h2></header><div class="rules" style="grid-template-columns:repeat(auto-fit,minmax(190px,1fr))">${B.etapes.map(e=>`<div><b>${e[0]}</b><span>${e[1]}</span></div>`).join("")}</div></div>
  <div class="sec"><header><p class="eyebrow">Reformuler</p><h2>De l’objet au problème</h2></header><div class="transfo">${B.transfo.map(t=>`<div><span class="o">« ${t[0]} »</span><span class="a">→</span><span class="p">« ${t[1]} »${SPMAP[t[2]]?` <a href="#${t[2]}">Voir la fiche</a>`:""}</span></div>`).join("")}</div></div>
  <div class="sec"><header><p class="eyebrow">Repérer</p><h2>Des situations quotidiennes, lieu par lieu</h2></header><div class="places">${B.lieux.map(l=>`<div><h3>${l[0]}</h3><ul class="clean learn">${l[1].map((x,k)=>`<li>${SPMAP[l[2][k]]?`<a href="#${l[2][k]}">${x}</a>`:x}</li>`).join("")}</ul></div>`).join("")}</div></div>
  <div class="two"><div class="box"><h3>Est-ce une bonne situation-problème ?</h3><ul class="clean checklist" style="gap:8px">${B.grille.map(g=>`<li>${g}</li>`).join("")}</ul><p style="margin-top:10px;font-size:.93rem;color:var(--muted)">Si vous répondez non à la première ou à la dernière question, la situation reste une activité de reproduction : élargissez-la.</p></div>
  <div class="box"><h3>Fiche de cadrage, à recopier</h3><table class="mat">${B.cadrage.map(c=>`<tr><td style="white-space:normal">${c}</td><td style="border-bottom:1px dashed var(--line);width:55%"></td></tr>`).join("")}</table></div></div>
  <div class="example"><p class="eyebrow">Pour aller plus vite</p><p>La <a href="#cr-banque">banque de situations</a> donne des situations déjà cadrées. Chaque <a href="#projets">projet du site</a> propose aussi, dans sa note enseignant, une entrée par un problème.</p></div>`;
}

/* ---- Fiche situation ---- */
function progFor(s){const lv=levels(s.niv);if(!lv.length||!s.disc)return "";D.__sp={notions:s.disc.map(d=>[d])};const h=progBlock({id:"__sp",niv:s.niv});delete D.__sp;return h.replace('class="box prof progbox"','class="box progbox"')}
function notionLinks(s){const g=Object.keys(GROUPS).filter(k=>(s.disc||[]).some(d=>GROUPS[k].includes(d)));return g.length?`<p class="notionlink">Les notions de ces disciplines dans les projets du site : ${g.map(k=>`<a href="#notions-${k}">${GLABEL[k]}</a>`).join(" · ")}</p>`:""}
function renderSP(id){
  const s=SPMAP[id],v=document.getElementById("v-sp");
  const tech=(s.full?s.creativite.techniques:s.techniques)||[];
  const techHTML=`<div class="techs">${tech.filter(t=>TOOLMAP[t]).map(t=>`<a href="#cr-outils-${t}">${TOOLMAP[t].nom}</a>`).join("")}</div>`;
  const res=(s.liens||[]).filter(x=>P.find(p=>p.id===x));
  const resHTML=res.length?`<div class="sec"><header><p class="eyebrow">Ressources du site</p><h2>Fiches techniques utiles pendant le projet</h2><p style="color:var(--muted);max-width:46em;margin-top:6px">À distribuer après la phase d’idées, au groupe qui en a besoin, pour un geste précis. Jamais au départ.</p></header><div class="rescards">${res.map(projMini).join("")}</div></div>`:"";
  const head=`${crSub("cr-banque")}
  <nav class="crumb" aria-label="Fil d’Ariane"><a href="#creativite">Projets & créativité</a><span>›</span><a href="#cr-banque">Banque</a><span>›</span><span>${s.titre}</span></nav>
  <div class="sphead"><div><p class="eyebrow">${s.niv} · ${s.cycles.map(c=>CYCN[c]).join(", ")} · ${s.age}${s.full?" · fiche détaillée":""}</p><h1 style="margin-top:8px">${s.titre}</h1>
   <div class="sitbox" style="margin-top:16px"><span class="eyebrow">Situation de départ</span><p>${s.situation}</p></div>
   <div class="probleme"><span class="eyebrow">Problématique</span><p>${s.question}</p></div></div>
   <div style="display:flex;flex-direction:column;gap:12px"><dl class="facts" style="margin-top:0">
    <div><dt>Durée</dt><dd>${s.dureeTxt||CR_DUREES[s.duree]}</dd></div><div><dt>Démarche</dt><dd>${CR_DEMS[s.demarche]}</dd></div><div><dt>Ouverture</dt><dd>${CR_OUVS[s.ouv]}</dd></div><div><dt>Âge</dt><dd>${s.age}</dd></div></dl>
    <div class="meta">${s.theme.map(t=>`<a class="tag th" href="#cr-banque?t=${t}">${CR_THEMES[t][0]}</a>`).join("")}${s.mat.map(m=>`<span class="tag mach">${CR_MATS[m]}</span>`).join("")}</div>
    ${s.orga?`<div class="box" style="padding:12px 14px"><span class="eyebrow">Organisation</span><p style="margin-top:4px;font-size:.95rem">${s.orga}</p></div>`:""}
    ${typeof SPPDF!=="undefined"&&SPPDF[s.id]?`<a class="btn primary" href="pdf/situations/${SPPDF[s.id]}" target="_blank" rel="noopener">Fiche PDF</a>`:""}${typeof SPPAGE!=="undefined"&&SPPAGE[s.id]?`<a class="btn primary" href="pdf/situations-banque.pdf#page=${SPPAGE[s.id]}" target="_blank" rel="noopener">Fiche PDF · page ${SPPAGE[s.id]} du recueil</a>`:""}
   </div></div>
  <div class="adire"><span class="eyebrow">À dire aux élèves</span><p>« ${s.aDire} »</p></div>`;
  if(!s.full){
    v.innerHTML=`${head}
    <div class="two"><div class="box"><h3>Le besoin</h3><p>${s.besoin}</p><h4 style="margin-top:12px">Utilisateur</h4><p>${s.utilisateur}</p><h4 style="margin-top:12px">Contraintes</h4>${ul(s.contraintes)}</div>
    <div class="nepas"><h3>Ce qu’il ne faut surtout pas donner au départ</h3><ul class="clean">${s.nepas.map(x=>`<li>${x}</li>`).join("")}</ul></div></div>
    <div class="two"><div class="box"><h3>Faire émerger plusieurs idées</h3>${techHTML}<p style="margin-top:10px;font-size:.93rem;color:var(--muted)">Ouvrez la technique dans la boîte à outils pour son déroulé.</p></div>
    <div class="box"><h3>Tester et améliorer</h3><p>${s.tester}</p><div class="trap" style="margin-top:10px"><b>Au premier essai · </b>${s.iteration}</div></div></div>
    <div class="quest"><h3 style="margin-bottom:10px">Questions pour faire réfléchir</h3><ul>${s.questions.map(q=>`<li>${q}</li>`).join("")}</ul></div>
    <details class="pistes"><summary>Solutions que les élèves proposent souvent (pour vous, à ne pas montrer)</summary>${ul(s.pistes)}</details>
    <div class="two"><div class="fabbox"><span class="eyebrow">Le FabLab au service du projet</span><p>${s.fablab}</p></div><div class="box"><h3>Ce que l’élève apprend</h3><p>${s.apprend}</p>${notionLinks(s)}</div></div>
    ${progFor(s)}${resHTML}`;
    return;
  }
  const T=[["probleme","Le problème"],["idees","Les idées"],["proto","Prototypes et tests"],["seances","Séances"],["regards","Regards et programmes"],["adapter","Adapter"]];
  v.innerHTML=`${head}
  <div class="tabs" role="tablist">${T.map((t,k)=>`<button role="tab" data-t="${t[0]}" aria-selected="${k===0}">${t[1]}</button>`).join("")}<button class="all" data-t="__all">Tout afficher</button></div>
  <div id="sptabs">
  <section class="tabp" data-t="probleme"><h2 class="tabtitle">Le problème</h2>
   <div class="two"><div class="box"><h3>Besoin identifié</h3><p>${s.besoin}</p><h4 style="margin-top:12px">Utilisateur ou bénéficiaire</h4><p>${s.utilisateur}</p></div><div class="box"><h3>Contraintes</h3>${ul(s.contraintes)}</div></div>
   <div class="two"><div class="box"><h3>Matériel mis à disposition</h3>${ul(s.materiel,"clean check")}<p style="margin-top:10px;font-size:.92rem;color:var(--muted)">En vrac, sans montrer d’assemblage.</p></div><div class="nepas"><h3>Ce qu’il ne faut surtout pas donner au départ</h3><ul class="clean">${s.nepas.map(x=>`<li>${x}</li>`).join("")}</ul></div></div>
  </section>
  <section class="tabp" data-t="idees" hidden><h2 class="tabtitle">Faire émerger les idées</h2>
   <div class="box"><h3>Phase de créativité</h3>${techHTML}<p style="margin-top:12px">${s.creativite.deroule}</p></div>
   <div class="two"><div class="box"><h3>Productions initiales</h3><p>${s.productions}</p></div><details class="pistes" style="align-self:start"><summary>Solutions que les élèves proposent souvent (pour vous, à ne pas montrer)</summary>${ul(s.pistes)}</details></div>
   <div class="quest"><h3 style="margin-bottom:10px">Questions pour faire réfléchir</h3><ul>${s.questions.map(q=>`<li>${q}</li>`).join("")}</ul></div>
  </section>
  <section class="tabp" data-t="proto" hidden><h2 class="tabtitle">Prototyper, tester, améliorer</h2>
   <div class="iter"><div><span class="eyebrow">Prototype 1</span><p>${s.proto1}</p></div><div><span class="eyebrow">Test</span><p><b>Ce qu’on teste :</b> ${s.test.quoi}</p><p><b>Comment :</b> ${s.test.comment}</p></div><div class="bad"><span class="eyebrow">Analyse des résultats</span><p>${s.analyse}</p></div><div><span class="eyebrow">Prototype 2</span><p>${s.proto2}</p></div></div>
   <div class="box"><h3>Critères de réussite</h3>${ul(s.criteres,"clean check")}</div>
   <div class="sec"><header><h3>Problèmes qui apparaissent souvent, et modifications possibles</h3></header><div class="fixes">${s.problemes.map(p=>`<div><span class="pb">${p[0]}</span><span class="fx">${p[1]}</span></div>`).join("")}</div></div>
   <div class="two"><div class="box"><h3>Réalisation finale</h3><p>${s.finale}</p></div><div class="box"><h3>Présentation et valorisation</h3><p>${s.valorisation}</p></div></div>
  </section>
  <section class="tabp" data-t="seances" hidden><h2 class="tabtitle">Séances</h2>
   <div class="seances">${s.seances.map(se=>`<div class="box seance"><h4>${se.t}<span>${se.d}</span></h4><div class="timeline">${se.ph.map(f=>`<div><b>${f[0]}</b><span>${f[1]}</span></div>`).join("")}</div></div>`).join("")}</div>
  </section>
  <section class="tabp" data-t="regards" hidden><h2 class="tabtitle">Trois regards et programmes</h2>
   <div class="regards3"><div><h3>Ce que fait l’élève</h3>${ul(s.eleve)}</div><div><h3>Ce que fait l’enseignant</h3>${ul(s.enseignant)}</div><div><h3>Ce que l’élève apprend</h3>${ul(s.apprend)}</div></div>
   <div class="two"><div class="box"><h3>Connaissances travaillées</h3>${ul(s.connaissances)}</div><div class="box"><h3>Compétences travaillées</h3>${ul(s.competences)}</div></div>
   <div class="sec"><header><h3>Liens avec les programmes</h3><p style="color:var(--muted);font-size:.93rem;margin-top:4px">Entre guillemets : formulations exactes des programmes. Sans guillemets : reformulations. Chaque lien dit pourquoi il est réellement travaillé.</p></header><div class="ptable"><table><thead><tr><th>Type</th><th>Référence</th><th>Ce qui est travaillé</th><th>Pourquoi ici</th></tr></thead><tbody>${s.programmes.map(r=>`<tr><td><span class="ptype t-${r.type}">${r.type}</span></td><td>${r.ref}</td><td>${r.txt}</td><td class="why">${r.pourquoi}</td></tr>`).join("")}</tbody></table></div>${notionLinks(s)}</div>
   ${progFor(s)}
  </section>
  <section class="tabp" data-t="adapter" hidden><h2 class="tabtitle">Adapter</h2>
   <div class="two"><div class="box"><h3>Différenciation</h3>${ul(s.differenciation)}</div><div class="box"><h3>Difficultés prévisibles</h3>${ul(s.difficultes)}</div></div>
   <div class="two"><div class="box"><h3>Aides possibles, sans donner la solution</h3>${ul(s.aides)}</div><div class="box"><h3>Prolongements</h3>${ul(s.prolongements)}</div></div>
   <div class="fabbox"><span class="eyebrow">Le FabLab au service du projet</span><p>${s.fablab}</p></div>
  </section>
  </div>
  ${resHTML}`;
  const tabs=v.querySelectorAll(".tabs button"),wrap=v.querySelector("#sptabs");
  tabs.forEach(b=>b.addEventListener("click",()=>{
    if(b.dataset.t==="__all"){const on=!wrap.classList.contains("showall");wrap.classList.toggle("showall",on);b.textContent=on?"Afficher par onglets":"Tout afficher";return}
    wrap.classList.remove("showall");v.querySelector(".tabs .all").textContent="Tout afficher";
    tabs.forEach(x=>{if(x.dataset.t!=="__all")x.setAttribute("aria-selected",x===b?"true":"false")});
    wrap.querySelectorAll(".tabp").forEach(p=>p.hidden=p.dataset.t!==b.dataset.t);
    const top=v.querySelector(".tabs").getBoundingClientRect().top+scrollY-(parseInt(getComputedStyle(document.documentElement).getPropertyValue("--hh"))||58);if(scrollY>top)scrollTo(0,top);
  }));
}

/* ---- Note enseignant dans chaque projet existant ---- */
function noteBlock(p){
  const n=NOTES[p.id];if(!n)return "";
  const sps=(SP_BY_P[p.id]||[]).filter(id=>SPMAP[id]);
  return `<div class="crnote prof">
  <header><div><p class="eyebrow">Note enseignant</p><h2 style="margin-top:4px">Comment aborder ce projet ?</h2></div><span class="tag ouv-${n.ouv}">Entrée ${CR_OUVS[n.ouv].toLowerCase()}</span></header>
  <div class="cols"><div style="display:flex;flex-direction:column;gap:12px"><p>${n.sit}</p><div class="probleme" style="margin-top:0"><span class="eyebrow">Partir d’une situation-problème</span><p>${n.q}</p></div><div class="adire"><span class="eyebrow">À dire aux élèves</span><p>« ${n.dire} »</p></div></div>
  <div style="display:flex;flex-direction:column;gap:12px"><div class="nepas"><h3>Ce qu’il ne faut surtout pas donner au départ</h3><ul class="clean">${n.nepas.map(x=>`<li>${x}</li>`).join("")}</ul></div><div class="trap"><b>Au premier essai · </b>${n.iteration}</div></div></div>
  <div class="quest"><h3 style="margin-bottom:10px">Questions pour faire réfléchir</h3><ul>${n.questions.map(q=>`<li>${q}</li>`).join("")}</ul></div>
  <p class="usage"><b>Les étapes de fabrication de cette fiche · </b>${n.usage}</p>
  <div class="etsi"><span class="eyebrow">Et si on partait plutôt d’un problème ?</span><p>${n.variante}</p>${sps.length?`<div><span style="font-size:.9rem;opacity:.9">Situations-problèmes de la banque qui utilisent cette fiche :</span><div class="sps" style="margin-top:6px">${sps.map(id=>`<a href="#${id}">${SPMAP[id].titre}</a>`).join("")}</div></div>`:""}<a href="#creativite">La démarche Projets & créativité →</a></div>
  </div>`;
}

/* ---- Routage de la rubrique ---- */
function renderCR(h,qs){
  const v=document.getElementById("v-cr");
  const page=h.startsWith("cr-outils")?"cr-outils":h;
  const F={"creativite":crHome,"cr-demarche":crDemarche,"cr-progression":crProgression,"cr-banque":()=>crBanque(qs),"cr-outils":crOutils,"cr-prototyper":crPrototyper,"cr-accompagner":crAccompagner,"cr-probleme":crProbleme};
  v.innerHTML=(F[page]||crHome)();
  if(page==="cr-banque")bankBind();
  if(page==="cr-outils"&&h.length>10){const t=document.getElementById("t-"+h.slice(10));if(t){t.open=true;setTimeout(()=>t.scrollIntoView({block:"start"}),30);return true}}
  return false;
}
function setHH(){const hd=document.querySelector("header.top");if(hd)document.documentElement.style.setProperty("--hh",hd.offsetHeight+"px")}
window.addEventListener("resize",setHH);/* ---------- Matériel : rendu ---------- */
const MAT_PAGES=[["materiel","Le matériel"],["mat-espace","Organiser l’espace"],["mat-catalogue","Catalogue"],["mat-niveaux","Par niveau"],["mat-equiper","Équiper progressivement"],["securite","Sécurité"]];
const MAT_SRC="https://github.com/xseorkly/fablab";
const MAT_SAF={vert:"Autonome",orange:"Accompagné",rouge:"Adulte"};
const MAT_LV=["C1","C2","C3","6e","5e","4e","3e","2nde"];
const MAT_CAT=Object.fromEntries(MAT.cats.map(c=>[c.n,c]));
function matSub(cur){return `<nav class="crsub" aria-label="Rubrique Matériel">${MAT_PAGES.map(([h,l])=>`<a href="#${h}"${h===cur?' aria-current="page"':""}>${l}</a>`).join("")}</nav>`}
const matIco=c=>`<span class="mico" style="color:${(MAT_CAT[c]||{}).col||"var(--mat)"}"><svg viewBox="0 0 100 100" aria-hidden="true">${MAT.icons[c]||""}</svg></span>`;
const matSource=()=>`<p class="techres" style="margin-top:4px"><b>Source · </b>volume 1 « Laboratoire de créativité & FabLab », Fehmi Klabi et François Monnier, actions de formation ZECO et ZESE. <a href="${MAT_SRC}" target="_blank" rel="noopener">Dépôt et PDF sur GitHub</a>.</p>`;
function matLevels(i){const s=i.cy.join(" · ");const l=i.lv;let t="";if(l.length){t=l.length>1?`${l[0]}–${l[l.length-1]}`:l[0]}return [s,t].filter(Boolean).join(" · ")}

function matHome(){
  return `${matSub("materiel")}
  <div class="crhero"><div><p class="eyebrow">Matériel, matériaux, machines</p><h1 style="margin-top:10px">Équiper un FabLab au service des apprentissages</h1>
  <p class="lead">Le matériel n’est jamais une fin : il est choisi parce qu’il permet de résoudre, représenter, expérimenter ou communiquer. Un espace très riche peut commencer avec du carton, des outils simples, une matériauthèque, quelques instruments de mesure et une culture de projet solide.</p>
  <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:22px"><a class="btn primary" href="#mat-catalogue">Parcourir le catalogue</a><a class="btn ghost" href="#mat-niveaux">Le matériel de mon niveau</a></div></div></div>
  <div class="entries">
   <a class="entry" href="#mat-espace"><span class="ico">${crIco("grid")}</span><b>Organiser l’espace</b><span>Neuf zones de création. La table où l’on cherche reste au centre, les machines en zone protégée.</span></a>
   <a class="entry" href="#mat-catalogue"><span class="ico">${crIco("search")}</span><b>Le catalogue</b><span>${MAT.items.length} matériels : pourquoi, un exemple d’usage, les niveaux, le repère de sécurité, une quantité indicative.</span></a>
   <a class="entry" href="#mat-niveaux"><span class="ico">${crIco("stairs")}</span><b>Par niveau, de la PS à la 2nde</b><span>Compétences travaillées, matériel prioritaire et matériel à ajouter, classe par classe.</span></a>
   <a class="entry" href="#mat-equiper"><span class="ico">${crIco("box")}</span><b>Équiper progressivement</b><span>Commencer à presque zéro euro, puis trois niveaux d’équipement chiffrés.</span></a>
   <a class="entry" href="#securite"><span class="ico">${crIco("hand")}</span><b>Sécurité</b><span>Le code vert, orange, rouge et qui fait quoi selon l’âge.</span></a>
  </div>
  <div class="sec"><header><p class="eyebrow">Entrer par famille</p><h2>Dix-sept familles de matériel</h2></header><div class="themes">${MAT.cats.map(c=>`<a href="#mat-catalogue?f=${encodeURIComponent(c.n)}"><b style="display:flex;gap:8px;align-items:center">${matIco(c.n)}${c.n}</b><em>${c.k} matériels</em></a>`).join("")}</div></div>
  <div class="sec"><header><p class="eyebrow">Douze principes</p><h2>Les choix qui rendent le laboratoire vraiment éducatif</h2></header><div class="rules">${MAT.principes.map(p=>`<div><b>${p[0]}</b><span>${p[1]}</span></div>`).join("")}</div></div>
  ${matSource()}`;
}

function matPlan(){
  const z=["Idées & dessin","Papier & carton","Textile","Matière, modelage","Construction","Électronique","Fabrication numérique","Média","Matériauthèque"];
  const box=(x,y,w,h,n,t,extra="")=>`<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" style="fill:var(--card);stroke:var(--line);stroke-width:2${extra}"/><text x="${x+14}" y="${y+28}" style="font:800 18px var(--f-display);fill:var(--mat)">${n}</text><text x="${x+40}" y="${y+28}" style="font:700 15px var(--f-body);fill:var(--ink)">${t}</text></g>`;
  return `<svg viewBox="0 0 960 470" role="img" aria-label="Plan type : la table de projet au centre, les zones autour, les machines en zone protégée">
  <rect x="10" y="10" width="940" height="450" rx="16" style="fill:var(--bg);stroke:var(--ink);stroke-width:3"/>
  ${box(30,30,280,90,"1",z[0])}${box(340,30,280,90,"2",z[1])}${box(650,30,280,90,"3",z[2])}
  ${box(30,150,200,130,"4",z[3])}${box(30,310,200,130,"5",z[4])}
  <rect x="270" y="160" width="420" height="140" rx="70" style="fill:var(--mat-soft);stroke:var(--mat);stroke-width:3"/>
  <text x="480" y="220" text-anchor="middle" style="font:800 22px var(--f-display);fill:var(--mat)">La table de projet</text>
  <text x="480" y="250" text-anchor="middle" style="font:15px var(--f-body);fill:var(--ink)">chercher · dessiner · manipuler · construire</text>
  ${box(730,150,200,130,"6",z[5])}
  <g><rect x="730" y="310" width="200" height="130" rx="10" style="fill:var(--tape-soft);stroke:var(--cut);stroke-width:2.5;stroke-dasharray:8 6"/><text x="744" y="338" style="font:800 18px var(--f-display);fill:var(--mat)">7</text><text x="770" y="338" style="font:700 15px var(--f-body);fill:var(--ink)">Fabrication</text><text x="770" y="358" style="font:700 15px var(--f-body);fill:var(--ink)">numérique</text><text x="744" y="420" style="font:700 13px var(--f-body);fill:var(--cut)">zone protégée</text></g>
  ${box(270,330,200,110,"8","Média")}${box(490,330,200,110,"9","Matériauthèque")}
  </svg>`;
}
function matEspace(){
  return `${matSub("mat-espace")}
  <div><p class="eyebrow">Organiser l’espace</p><h1 style="margin-top:10px">Neuf zones de création</h1><p style="font-size:1.15rem;color:var(--muted);margin-top:14px;max-width:44em">L’idéal est un espace modulable. Les machines ne doivent pas occuper le centre symbolique du laboratoire : le cœur du lieu reste la table où l’on cherche, dessine, manipule et construit.</p></div>
  <div class="flowsvg matplan">${matPlan()}</div>
  <div class="rules">${MAT.zones.map(z=>`<div><b>${z[0].replace(/^\d+\.\s*/,"")}</b><span>${z[1]}</span></div>`).join("")}</div>
  <div class="example"><p class="eyebrow">Dans une salle de classe ordinaire</p><p>Les zones peuvent être de simples bacs étiquetés que l’on sort au moment du projet. La matériauthèque visible est la plus importante : un élève invente davantage lorsqu’il sait ce qui est disponible. Voir aussi <a href="#cr-prototyper">le kit de prototypage à presque zéro euro</a>.</p></div>
  ${matSource()}`;
}

const MF={f:"all",l:"all",s:"all",q:""};
function matCatalogue(qs){
  Object.keys(MF).forEach(k=>MF[k]=k==="q"?"":"all");
  new URLSearchParams(qs||"").forEach((v,k)=>{if(k in MF)MF[k]=v});
  const chips=(k,o)=>`<button class="chip" data-k="${k}" data-v="all" aria-pressed="${MF[k]==="all"}">Tous</button>${o.map(([v,l])=>`<button class="chip${k==="s"?" saf-"+v:""}" data-k="${k}" data-v="${v}" aria-pressed="${MF[k]===v}">${l}</button>`).join("")}`;
  return `${matSub("mat-catalogue")}
  <div><p class="eyebrow">Catalogue</p><h1 style="margin-top:10px">${MAT.items.length} matériels, choisis pour ce qu’ils font apprendre</h1><p style="font-size:1.15rem;color:var(--muted);margin-top:14px;max-width:46em">Chaque fiche indique le rôle pédagogique, un exemple d’usage, les cycles et niveaux concernés, un repère de sécurité et une quantité indicative pour une classe d’environ 24 élèves travaillant en équipes.</p></div>
  <div class="bfilters" id="matfilters">
   <div class="bfrow"><span class="lab">Niveau</span>${chips("l",MAT_LV.map(v=>[v,v]))}</div>
   <div class="bfrow"><span class="lab">Sécurité</span>${chips("s",[["vert","Autonome"],["orange","Accompagné"],["rouge","Adulte"]])}</div>
   <div class="bfsel"><label>Famille<select data-k="f"><option value="all">Toutes</option>${MAT.cats.map(c=>`<option value="${c.n}"${MF.f===c.n?" selected":""}>${c.n} (${c.k})</option>`).join("")}</select></label><label>Rechercher<input type="search" id="mq" value="${MF.q}" placeholder="laser, carton, capteur…"></label></div>
  </div>
  <div class="bcount"><b id="mcount"></b><button class="linkbtn" id="mreset">Tout effacer</button></div>
  <div class="matcards" id="mcards"></div>
  <p id="mnores" class="eyebrow" hidden>Aucun matériel pour ces critères.</p>
  <p class="techres"><b>Lire les repères · </b>C1, C2, C3 : cycles de l’école ; 6e à 2nde : niveaux du secondaire à partir desquels le matériel est conseillé. Un matériel peut servir à plusieurs niveaux : c’est le principe d’un FabLab mutualisé. Le repère de sécurité se croise avec <a href="#securite">qui fait quoi selon l’âge</a> et le règlement de l’établissement.</p>
  ${matSource()}`;
}
function matApply(){
  const q=MF.q.trim().toLowerCase();
  const L=MAT.items.filter(i=>(MF.f==="all"||i.c===MF.f)&&(MF.s==="all"||i.s===MF.s)&&(MF.l==="all"||i.cy.includes(MF.l)||i.lv.includes(MF.l))&&(!q||(i.n+" "+i.why+" "+i.ex+" "+i.c).toLowerCase().includes(q)));
  document.getElementById("mcards").innerHTML=L.map(i=>`<article class="matcard">${matIco(i.c)}<div><p class="eyebrow">${i.c}</p><h3>${i.n}</h3><div class="meta" style="margin-top:6px;padding-top:0"><span class="tag">${matLevels(i)||"—"}</span><span class="tag saf saf-${i.s}">${MAT_SAF[i.s]}</span></div><p><b>Pourquoi ?</b> ${i.why}</p><p><b>Exemple.</b> ${i.ex}</p>${i.q?`<p class="qty">Quantité indicative : ${i.q}</p>`:""}</div></article>`).join("");
  document.getElementById("mcount").textContent=L.length+(L.length>1?" matériels":" matériel");
  document.getElementById("mnores").hidden=L.length>0;
  const p=new URLSearchParams();Object.entries(MF).forEach(([k,v])=>{if(v&&v!=="all")p.set(k,v)});
  history.replaceState(null,"","#mat-catalogue"+(p.toString()?"?"+p:""));
}
function matBind(){
  const f=document.getElementById("matfilters");
  f.querySelectorAll(".chip").forEach(b=>b.addEventListener("click",()=>{MF[b.dataset.k]=b.dataset.v;f.querySelectorAll(`.chip[data-k="${b.dataset.k}"]`).forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));matApply()}));
  f.querySelector("select").addEventListener("change",e=>{MF.f=e.target.value;matApply()});
  document.getElementById("mq").addEventListener("input",e=>{MF.q=e.target.value;matApply()});
  document.getElementById("mreset").addEventListener("click",()=>{location.hash="mat-catalogue"});
  matApply();
}

function matNiveaux(qs){
  const all=[...MAT.prim,...MAT.sec];
  const cur=new URLSearchParams(qs||"").get("n")||"CP";
  const L=all.find(x=>x.lv===cur)||all[0];
  const isSec=MAT.sec.includes(L);
  const cyc={PS:"1",MS:"1",GS:"1",CP:"2",CE1:"2",CE2:"2",CM1:"3",CM2:"3","6e":"3","5e":"4","4e":"4","3e":"4"}[L.lv];
  return `${matSub("mat-niveaux")}
  <div><p class="eyebrow">Par niveau</p><h1 style="margin-top:10px">Le matériel de ma classe</h1><p style="font-size:1.15rem;color:var(--muted);margin-top:14px;max-width:46em">Le matériel est un socle mutualisé qui s’enrichit progressivement. Pour chaque niveau : ce que le FabLab permet de travailler, le matériel à rendre disponible en priorité et les équipements à introduire ensuite. Un niveau inscrit ne signifie pas que l’équipement est interdit aux autres classes.</p></div>
  <div class="bfilters"><div class="bfrow"><span class="lab">École</span>${MAT.prim.map(x=>`<a class="chip" href="#mat-niveaux?n=${x.lv}" aria-pressed="${x===L}">${x.lv}</a>`).join("")}</div><div class="bfrow"><span class="lab">Secondaire</span>${MAT.sec.map(x=>`<a class="chip" href="#mat-niveaux?n=${encodeURIComponent(x.lv)}" aria-pressed="${x===L}">${x.lv}</a>`).join("")}</div></div>
  <article class="lvcard" style="border-top-color:${L.col}">
   <header><p class="lvbig" style="color:${L.col}">${L.lv}</p><div><p class="eyebrow">${L.tag}</p><h2>${L.t}</h2></div></header>
   <div class="lvcols">${L.cols.map((c,k)=>`<div class="${k===0&&!isSec?"know":""}"><h3>${c[0]}</h3>${ul(c[1])}</div>`).join("")}</div>
   ${L.use?`<p class="lvuse"><b>Ce que ce parc permet · </b>${L.use}</p>`:""}
   ${isSec?`<div class="safety" style="margin-top:4px"><h3>Règle de sécurité</h3><p>${MAT.secrule}</p></div>`:""}
  </article>
  <div class="example"><p class="eyebrow">Et ensuite ?</p><p>${cyc?`Les <a href="#cr-banque?c=${cyc}">situations-problèmes du cycle ${cyc}</a> et les <a href="#projets">projets du site</a> montrent ce matériel au service d’un problème.`:`Au lycée, ce parc prolonge celui du collège, notamment pour la SNT : données, réseaux, objets connectés.`} Le détail de chaque matériel est dans <a href="#mat-catalogue?l=${encodeURIComponent(/^(PS|MS|GS)$/.test(L.lv)?"C1":/^(CP|CE1|CE2)$/.test(L.lv)?"C2":/^(CM1|CM2)$/.test(L.lv)?"C3":L.lv)}">le catalogue filtré pour ce niveau</a>.</p></div>
  ${matSource()}`;
}

function matEquiper(){
  return `${matSub("mat-equiper")}
  <div><p class="eyebrow">Équiper progressivement</p><h1 style="margin-top:10px">Commencer petit, enrichir ensuite</h1><p style="font-size:1.15rem;color:var(--muted);margin-top:14px;max-width:46em">La réussite du laboratoire ne dépend pas d’un investissement massif au départ. Chaque achat répond à un besoin de projet, pas à l’envie d’avoir une machine.</p></div>
  <div class="two"><div class="box"><h3>Pour commencer, à presque zéro euro</h3>${ul(CR_PROTO.kit)}<p style="margin-top:10px;font-size:.93rem;color:var(--muted)">Presque toutes les situations de la <a href="#cr-banque?m=sans">banque</a> se réalisent avec ce kit.</p></div>
  <div class="box"><h3>La matériauthèque</h3><p>Bouchons, couvercles, rouleaux, boîtes, chutes de bois, de liège ou de mousse, objets hors tension à démonter : triés par matériau dans des bacs transparents étiquetés. C’est le « magasin » où l’élève vient choisir.</p><p style="margin-top:10px"><a href="#mat-catalogue?f=${encodeURIComponent("Récupération & éco-conception")}">Voir la famille Récupération & éco-conception</a></p></div></div>
  <div class="sec"><header><p class="eyebrow">Trois niveaux de déploiement</p><h2>Essentiel, développé, complet</h2></header>
   <div class="deploy">${MAT.deploy.map((d,k)=>`<div class="${k===0?"first":""}"><p class="eyebrow">Niveau ${k+1}</p><h3>${d.n}</h3><p class="budget">${d.b}</p><p style="color:var(--muted)">${d.p}</p>${ul(d.l)}</div>`).join("")}</div>
   <p style="font-size:.92rem;color:var(--muted)">Ordres de grandeur indicatifs, non contractuels, très variables selon le mobilier existant, les marchés locaux, les marques, les exigences de sécurité et les options de machines.</p></div>
  <div class="sec"><header><p class="eyebrow">Avant d’acheter une machine</p><h2>Quel outil, pour quel besoin ?</h2></header><div class="ptable"><table><thead><tr><th>Le projet a besoin de…</th><th>Outil possible</th><th>Quand et comment</th></tr></thead><tbody>${CR_PROTO.outils.map(o=>`<tr><td><b>${o[0]}</b></td><td>${o[1]}</td><td class="why">${o[2]}</td></tr>`).join("")}</tbody></table></div></div>
  ${matSource()}`;
}

function renderMat(h,qs){
  const v=document.getElementById("v-mat");
  const F={"materiel":matHome,"mat-espace":matEspace,"mat-catalogue":()=>matCatalogue(qs),"mat-niveaux":()=>matNiveaux(qs),"mat-equiper":matEquiper};
  v.innerHTML=(F[h]||matHome)();
  if(h==="mat-catalogue")matBind();
}

/* ---------- Formation : accès par code ---------- */
let FORM_HTML=null,FORM_CODE=null;
const b64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function formKey(code,salt){const k=await crypto.subtle.importKey("raw",new TextEncoder().encode(code),"PBKDF2",false,["deriveKey"]);return crypto.subtle.deriveKey({name:"PBKDF2",salt,iterations:200000,hash:"SHA-256"},k,{name:"AES-GCM",length:256},false,["decrypt"])}
async function formOpen(code){
  const k=await formKey(code,b64(FORM_ENC.s));
  const pt=await crypto.subtle.decrypt({name:"AES-GCM",iv:b64(FORM_ENC.i)},k,b64(FORM_ENC.c));
  FORM_HTML=new TextDecoder().decode(pt);FORM_CODE=code;
  try{sessionStorage.setItem("fablab-formation",code)}catch(e){}
}
async function formFile(name,label,btn){
  btn.disabled=true;const t=btn.textContent;btn.textContent="Déchiffrement…";
  try{const buf=new Uint8Array(await (await fetch("formation/"+name)).arrayBuffer());
    const k=await formKey(FORM_CODE,buf.slice(0,16));
    const pt=await crypto.subtle.decrypt({name:"AES-GCM",iv:buf.slice(16,28)},k,buf.slice(28));
    const u=URL.createObjectURL(new Blob([pt],{type:"application/pdf"}));
    const a=document.createElement("a");a.href=u;a.download=label;a.className="btn ghost";a.textContent="Enregistrer : "+label;a.style.marginLeft="8px";
    btn.insertAdjacentElement("afterend",a);try{a.click()}catch(e){}
    btn.textContent=t;btn.disabled=false;return;
  }catch(e){alert("Téléchargement impossible : "+e.message)}
  btn.disabled=false;btn.textContent=t;
}
function formRender(){
  const v=document.getElementById("v-formation");
  if(FORM_HTML){v.innerHTML=FORM_HTML;
    const dl=v.querySelector("#fdl");
    if(dl&&typeof FORM_FILES!=="undefined"){dl.innerHTML=FORM_FILES.map((f,k)=>`<button class="btn ${k?"ghost":"primary"}" data-k="${k}">${f[1]}</button>`).join("");dl.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>formFile(FORM_FILES[b.dataset.k][0],FORM_FILES[b.dataset.k][2],b)))}
    else if(dl){dl.innerHTML='<p class="techres">Les diaporamas et le déroulé en PDF se téléchargent depuis la version du site publiée sur GitHub.</p>'}
    return}
  v.innerHTML=`<div class="formlock box"><p class="eyebrow">Espace réservé</p><h1 style="margin-top:8px">Formation</h1><p style="color:var(--muted);margin-top:10px">Le déroulé, les diaporamas et les annexes de la formation « Le FabLab en classe » sont réservés aux formateurs. Saisissez le code d’accès.</p>
  <form id="fform" autocomplete="off"><label for="fcode" class="eyebrow">Code d’accès</label><div class="frow"><input id="fcode" type="password" required autocomplete="off" spellcheck="false"><button class="btn primary" type="submit">Ouvrir</button></div><p id="fmsg" role="alert"></p></form></div>`;
  const f=v.querySelector("#fform"),m=v.querySelector("#fmsg"),i=v.querySelector("#fcode");
  if(!(window.crypto&&crypto.subtle)){m.textContent="Ce navigateur ne permet pas d’ouvrir l’espace formation (connexion non sécurisée).";return}
  f.addEventListener("submit",async e=>{e.preventDefault();m.textContent="Vérification…";
    try{await formOpen(i.value.trim());formRender();scrollTo(0,0)}catch(err){m.textContent="Code incorrect.";i.select()}});
  setTimeout(()=>i.focus(),50);
}
async function formAuto(){let c=null;try{c=sessionStorage.getItem("fablab-formation")}catch(e){}
  if(c&&!FORM_HTML){try{await formOpen(c)}catch(e){}}formRender()}


const views=["accueil","projet","notions","demarrer","methode","securite","apropos","cr","sp","formation","mat"];
function route(){
  const raw=(location.hash||"#accueil").slice(1),h=raw.split("?")[0],qs=raw.split("?")[1]||"";
  const p=P.find(x=>x.id===h);
  let show=p?"projet":(views.includes(h)&&!["cr","sp","projet"].includes(h)?h:"accueil");
  if(h.startsWith("notions")){show="notions";renderNotions(h.split("-")[1])}
  if(h==="projets"){show="accueil"}
  let kept=false;
  if(h==="creativite"||h.startsWith("cr-")){show="cr";kept=renderCR(h,qs)}
  if(SPMAP[h]){show="sp";renderSP(h)}
  if(h==="formation"){formAuto()}
  if(h==="materiel"||h.startsWith("mat-")){show="mat";renderMat(h,qs)}
  document.body.classList.remove("eleve");
  views.forEach(v=>document.getElementById("v-"+v).hidden=(v!==show));
  if(p)renderProject(p);
  document.querySelectorAll("nav.main a").forEach(a=>a.toggleAttribute("aria-current",false));
  const navKey=show==="projet"?"accueil":(show==="cr"||show==="sp")?"creativite":show==="mat"?"materiel":show;
  const cur=document.querySelector(`nav.main a[data-nav="${navKey}"]`);if(cur)cur.setAttribute("aria-current","page");
  setHH();
  if(h==="projets"){document.getElementById("projets").scrollIntoView()}else if(!kept){window.scrollTo(0,0)}
}
window.addEventListener("hashchange",route);route();
