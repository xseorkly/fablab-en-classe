/* Outils de dessin des schémas */

/* ---------- Outils de dessin ---------- */
const S=(inner,vb="0 0 240 160")=>`<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" role="img">${inner}</svg>`;
function arr(x1,y1,x2,y2,c="a"){const a=Math.atan2(y2-y1,x2-x1),h=8;const p1=[x2-h*Math.cos(a-.5),y2-h*Math.sin(a-.5)],p2=[x2-h*Math.cos(a+.5),y2-h*Math.sin(a+.5)];return `<line class="${c}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><polyline class="${c}" points="${p1[0].toFixed(1)},${p1[1].toFixed(1)} ${x2},${y2} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}"/>`}
function cH(x1,x2,y,t){return `<line class="c" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}"/><line class="c" x1="${x1}" y1="${y-5}" x2="${x1}" y2="${y+5}"/><line class="c" x1="${x2}" y1="${y-5}" x2="${x2}" y2="${y+5}"/><text class="t" x="${(x1+x2)/2}" y="${y-6}" text-anchor="middle">${t}</text>`}
function cV(x,y1,y2,t,side="r"){const tx=side==="r"?x+7:x-7;return `<line class="c" x1="${x}" y1="${y1}" x2="${x}" y2="${y2}"/><line class="c" x1="${x-5}" y1="${y1}" x2="${x+5}" y2="${y1}"/><line class="c" x1="${x-5}" y1="${y2}" x2="${x+5}" y2="${y2}"/><text class="t" x="${tx}" y="${(y1+y2)/2+4}" text-anchor="${side==="r"?"start":"end"}">${t}</text>`}
const L=(x,y,t,c="l",a="start")=>`<text class="${c}" x="${x}" y="${y}" text-anchor="${a}">${t}</text>`;
const books=(x)=>`<rect class="k" x="${x}" y="96" width="50" height="12" rx="2"/><rect class="kd" x="${x+3}" y="108" width="46" height="12" rx="2"/><rect class="k" x="${x}" y="120" width="50" height="12" rx="2"/>`;
const car=(x,y)=>`<rect class="af" x="${x}" y="${y}" width="26" height="9" rx="3"/><rect class="af" x="${x+6}" y="${y-6}" width="13" height="7" rx="2"/><circle class="of" cx="${x+6}" cy="${y+10}" r="3.5"/><circle class="of" cx="${x+20}" cy="${y+10}" r="3.5"/>`;
const zig=(x1,x2,y,h=6,s=8)=>{let p=[];let up=true;for(let x=x1;x<=x2;x+=s){p.push(`${x},${up?y:y+h}`);up=!up}return `<polyline class="o" points="${p.join(" ")}"/>`};
const watch=(x,y)=>`<circle class="of" cx="${x}" cy="${y}" r="13"/><rect class="ink" x="${x-3}" y="${y-19}" width="6" height="4"/><line class="o" x1="${x}" y1="${y}" x2="${x}" y2="${y-8}"/><line class="o" x1="${x}" y1="${y}" x2="${x+6}" y2="${y+3}"/>`;
const snail=(cx,cy)=>{let d="";for(let i=0;i<=48;i++){const t=i/48*2*Math.PI,r=18+24*i/48,x=cx+r*Math.cos(t-Math.PI/2),y=cy+r*Math.sin(t-Math.PI/2);d+=(i?"L":"M")+x.toFixed(1)+" "+y.toFixed(1)+" "}return d+"Z"};
const tube=(x,y,w,h)=>`<rect class="of" x="${x}" y="${y}" width="${w}" height="${h}"/><ellipse class="of" cx="${x+w/2}" cy="${y}" rx="${w/2}" ry="4"/>`;

