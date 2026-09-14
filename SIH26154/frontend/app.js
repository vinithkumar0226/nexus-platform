let sourceId=null;
const $=id=>document.getElementById(id);
const API_BASE = `${window.location.protocol}//${window.location.hostname}:8000`;
const api=(path,options={})=>fetch(path.startsWith("http")?path:`${API_BASE}${path}`,options);
function msg(text,good=false){$("message").innerHTML=good?`<b>Success.</b> ${text}`:`<b>Next.</b> ${text}`;$("message").style.color=good?"#7ce0b1":"#8393a7"}
function setPipe(n,label){document.querySelectorAll(".pipe").forEach((x,i)=>x.classList.toggle("active",i===n-1));if(label)$("pipelineLabel").textContent=label}
async function refreshAudit(){try{const r=await api("/api/audit");const data=await r.json();$("mAudit").textContent=data.events.length;if(!data.events.length){$("auditContent").innerHTML='<p class="muted">No events yet.</p>';return}$("auditContent").innerHTML=data.events.slice().reverse().map(e=>`<div class="audit-event"><b>${e.event_type.replaceAll("_"," ")}</b><span>${e.timestamp}</span><span>hash: ${e.hash.slice(0,28)}…</span></div>`).join("")}catch(e){}}
function renderSource(d){$("mSource").textContent=1;$("mPages").textContent=d.pages;$("mSecurity").textContent=d.security_findings;$("sourceInfo").className="source-info";$("sourceInfo").innerHTML=`<div class="source-name">${d.filename}</div><div class="source-meta">${d.pages} page(s) · SHA-256 fingerprint</div><div class="hash">${d.sha256||"fingerprint recorded"}</div><div class="secure">● Source secured & scanned</div>`;$("dnaBtn").disabled=false;$("briefBtn").disabled=true;$("approveBtn").disabled=true;$("securityBadge").textContent=d.security_findings?"REVIEW":"CLEAR";$("securityContent").innerHTML=d.security?.length?d.security.map(x=>`<div class="security-item"><span>${x.type}<br><small>${x.masked}</small></span><span class="sev">${x.severity.toUpperCase()}</span></div>`).join(""):`<div class="empty-state compact"><div class="shield">✓</div><p><b>No demo-pattern findings detected.</b><br>Source is ready for structured analysis.</p></div>`;setPipe(1,"Source secured · ready to understand")}
function renderDNA(dna){$("dnaEmpty").classList.add("hidden");$("dnaContent").classList.remove("hidden");$("dnaStatus").textContent="READY";$("dnaSummary").textContent=dna.summary;const facts=dna.facts||[],ents=dna.entities||[],events=dna.events||[],claims=dna.claims||[];$("factsCount").textContent=facts.length;$("entitiesCount").textContent=ents.length;$("eventsCount").textContent=events.length;$("claimsCount").textContent=claims.length;$("mFacts").textContent=facts.length;$("factsList").innerHTML=facts.slice(0,7).map(x=>`<li>${x.text}</li>`).join("")||"<li>No facts detected.</li>";$("entitiesList").innerHTML=[...ents.slice(0,4).map(x=>`<li><b>${x.name}</b> · ${x.type}</li>`),...events.slice(0,3).map(x=>`<li><b>EVENT</b> · ${x.text}</li>`)].join("")||"<li>No entities or events detected.</li>";$("briefBtn").disabled=false;setPipe(3,"Content DNA ready · shared evidence layer created")}
function renderBrief(b){$("briefEmpty").classList.add("hidden");$("briefContent").classList.remove("hidden");$("briefStatus").textContent="DRAFT";$("briefTitle").textContent=b.title;$("situation").textContent=b.situation;$("impact").textContent=b.impact;$("risk").textContent=b.risk_assessment;$("findings").innerHTML=(b.key_findings||[]).map(x=>`<li>${x}</li>`).join("");$("actions").innerHTML=(b.recommended_actions||[]).map(x=>`<li>${x}</li>`).join("");$("approveBtn").disabled=false;setPipe(5,"Draft generated · validation & human review required");$("securityContent").innerHTML=`<div class="security-item"><span><b>Source linked</b><br><small>Input fingerprint retained</small></span><span class="sev" style="color:#70dcae">PASS</span></div><div class="security-item"><span><b>Content DNA linked</b><br><small>Shared evidence representation used</small></span><span class="sev" style="color:#70dcae">PASS</span></div><div class="security-item"><span><b>Human review</b><br><small>Approval is still required</small></span><span class="sev">PENDING</span></div>`;$("securityBadge").textContent="REVIEW"}
async function uploadFile(file){
  if(!file)return;
  const allowed=[".pdf",".docx",".txt"];
  const name=(file.name||"").toLowerCase();
  if(!allowed.some(x=>name.endsWith(x))){msg("Please choose a PDF, DOCX, or TXT file.");return;}
  if(file.size>20*1024*1024){msg("File is larger than 20 MB.");return;}

  msg("Uploading " + file.name + "  •  secure ingestion in progress…");
  $("uploadBox").classList.add("uploading");

  const fd=new FormData();
  fd.append("file",file,file.name);

  try{
    const r=await fetch(`${API_BASE}/api/sources/upload`,{
      method:"POST",
      body:fd,
      cache:"no-store"
    });
    const raw=await r.text();
    let d={};
    try{ d=JSON.parse(raw); }catch(_){}
    if(!r.ok) throw new Error(d.detail || ("Server returned HTTP "+r.status));
    sourceId=d.source_id;
    renderSource(d);
    await refreshAudit();
    msg("SOURCE RECEIVED ✓  Your document is now secured and ready for Content DNA.",true);
    setPipe(1,"Source secured · ready to understand");
  }catch(err){
    console.error("SIH upload error:",err);
    msg("Upload failed: "+err.message);
  }finally{
    $("uploadBox").classList.remove("uploading");
  }
}

const fileInput=$("fileInput");
const uploadBox=$("uploadBox");

// IMPORTANT: the file input is visually hidden, so explicitly open it
// when the user clicks the upload card / "Choose a file" control.
uploadBox.addEventListener("click",e=>{
  if(e.target !== fileInput) fileInput.click();
});

fileInput.addEventListener("change",e=>{
  const file=e.target.files && e.target.files[0];
  if(file) uploadFile(file);
  e.target.value="";
});

["dragenter","dragover"].forEach(type=>uploadBox.addEventListener(type,e=>{
  e.preventDefault(); e.stopPropagation();
  uploadBox.classList.add("dragging");
}));
["dragleave","drop"].forEach(type=>uploadBox.addEventListener(type,e=>{
  e.preventDefault(); e.stopPropagation();
  uploadBox.classList.remove("dragging");
}));
uploadBox.addEventListener("drop",e=>{
  const file=e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
  if(file) uploadFile(file);
});

$("demoFileBtn").addEventListener("click",async()=>{
  try{
    msg("Loading the included demo document…");
    const r=await fetch(`${API_BASE}/static/demo_incident_report.txt?v=2`,{cache:"no-store"});
    if(!r.ok) throw new Error("Demo document returned HTTP "+r.status);
    const blob=await r.blob();
    await uploadFile(new File([blob],"demo_incident_report.txt",{type:"text/plain"}));
  }catch(err){
    console.error(err);
    msg("Demo upload failed: "+err.message);
  }
});

$("dnaBtn").addEventListener("click",async()=>{$("dnaBtn").disabled=true;msg("Building the shared Content DNA…");try{const r=await api(`/api/sources/${sourceId}/analyze`,{method:"POST"});const d=await r.json();if(!r.ok)throw new Error(d.detail||"Analysis failed");renderDNA(d.dna);await refreshAudit();msg("Content DNA is ready. Generate the Executive Brief.",true)}catch(err){msg("Content DNA failed: "+err.message);$("dnaBtn").disabled=false}});
$("briefBtn").addEventListener("click",async()=>{$("briefBtn").disabled=true;msg("Transforming Content DNA into an Executive Intelligence Brief…");try{const r=await api(`/api/sources/${sourceId}/transform`,{method:"POST"});const d=await r.json();if(!r.ok)throw new Error(d.detail||"Generation failed");renderBrief(d.brief);await refreshAudit();msg("Draft generated. Read it, then approve only after human review.",true)}catch(err){msg("Generation failed: "+err.message);$("briefBtn").disabled=false}});
$("approveBtn").addEventListener("click",async()=>{if(!confirm("Approve this artifact as human-reviewed?"))return;$("approveBtn").disabled=true;msg("Recording human approval in the audit trail…");try{const r=await api(`/api/sources/${sourceId}/approve`,{method:"POST"});const d=await r.json();if(!r.ok)throw new Error(d.detail||"Approval failed");$("approvalBadge").textContent="APPROVED";$("approvalBadge").classList.add("approved");$("briefStatus").textContent="APPROVED";$("securityBadge").textContent="PASSED";$("securityContent").innerHTML=`<div class="empty-state compact"><div class="shield">✓</div><p><b>Human approval recorded.</b><br>The decision is now part of the hash-linked audit trail.</p></div>`;setPipe(7,"Approved · decision recorded in audit");await refreshAudit();msg("Approved. Audit trail now contains the human decision.",true)}catch(err){msg("Approval failed: "+err.message);$("approveBtn").disabled=false}});
refreshAudit();
