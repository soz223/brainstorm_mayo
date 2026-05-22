// Build the 33-slide advisor-meeting deck as an editable .pptx
// Run: node build_deck.js  ->  presentation-2026-05-22.pptx
const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";          // 13.33 x 7.5 in
pres.author = "Songlin Zhao";
pres.title  = "Longitudinal & Generative Foundation Models for 3D Medical Imaging";

const W = 13.33, H = 7.5;

// ---- palette (deep-navy premium, dark throughout) ----
const C = {
  bg:    "0D1B2A",
  panel: "16304A",
  panel2:"1E3D5C",
  card:  "13283F",
  white: "F4F8FB",
  mute:  "92A8BE",
  cyan:  "4CC9F0",
  amber: "FFB703",
  green: "56D364",
  red:   "F87171",
  line:  "2C4A66",
};
const HEAD = "Trebuchet MS";
const BODY = "Calibri";

// ---- helpers ----
function slideBg(s){ s.background = { color: C.bg }; }

function motif(s){ // short cyan vertical bar = the deck's repeated motif
  s.addShape(pres.shapes.RECTANGLE, { x:0.6, y:0.52, w:0.09, h:0.62, fill:{color:C.cyan}, line:{type:"none"} });
}
function kicker(s, txt){
  s.addText(txt.toUpperCase(), { x:0.82, y:0.46, w:11.5, h:0.3, fontFace:BODY,
    fontSize:11.5, color:C.cyan, bold:true, charSpacing:2, margin:0 });
}
function title(s, txt){
  s.addText(txt, { x:0.82, y:0.70, w:11.7, h:0.78, fontFace:HEAD,
    fontSize:27, color:C.white, bold:true, margin:0 });
}
function footer(s, n, section){
  s.addShape(pres.shapes.LINE, { x:0.6, y:6.95, w:12.13, h:0, line:{color:C.line,width:0.75} });
  s.addText(section, { x:0.6, y:7.0, w:9, h:0.35, fontFace:BODY, fontSize:9.5, color:C.mute, margin:0 });
  s.addText(String(n)+" / 33", { x:11.13, y:7.0, w:1.6, h:0.35, fontFace:BODY, fontSize:9.5,
    color:C.mute, align:"right", margin:0 });
}
function page(n, section){
  const s = pres.addSlide(); slideBg(s);
  return s;
}
function head(s, n, section, kick, ttl){
  motif(s); kicker(s, kick); title(s, ttl); footer(s, n, section);
}

// rounded box with centered (optionally rich) text
function box(s, x, y, w, h, txt, o){
  o = o || {};
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius:0.07,
    fill:{ color:o.fill||C.panel2 },
    line:{ color:o.line||C.cyan, width:o.lw||1.25 },
    shadow:{ type:"outer", color:"000000", blur:5, offset:2, angle:135, opacity:0.22 } });
  s.addText(txt, { x:x+0.05, y:y+0.02, w:w-0.1, h:h-0.04, align:"center", valign:"middle",
    fontFace:BODY, fontSize:o.fs||11, color:o.color||C.white, bold:o.bold||false, margin:3 });
}
// plain (no shadow) small node
function node(s, x, y, w, h, txt, o){
  o = o || {};
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius:0.06,
    fill:{ color:o.fill||C.panel }, line:{ color:o.line||C.line, width:o.lw||1 } });
  s.addText(txt, { x:x+0.04, y, w:w-0.08, h, align:"center", valign:"middle",
    fontFace:BODY, fontSize:o.fs||10, color:o.color||C.white, bold:o.bold||false, margin:2 });
}
function aR(s, x, y, w, color){ // arrow pointing right
  s.addShape(pres.shapes.LINE, { x, y, w, h:0,
    line:{ color:color||C.cyan, width:1.9, endArrowType:"triangle" } });
}
function aD(s, x, y, h, color){ // arrow pointing down
  s.addShape(pres.shapes.LINE, { x, y, w:0, h,
    line:{ color:color||C.cyan, width:1.9, endArrowType:"triangle" } });
}
function aDiag(s, x, y, w, h, color){
  s.addShape(pres.shapes.LINE, { x, y, w, h,
    line:{ color:color||C.cyan, width:1.7, endArrowType:"triangle" } });
}
function label(s, x, y, w, txt, o){
  o = o || {};
  s.addText(txt, { x, y, w, h:o.h||0.3, fontFace:BODY, fontSize:o.fs||10,
    color:o.color||C.mute, align:o.align||"center", bold:o.bold||false, italic:o.italic||false, margin:0 });
}
function bullets(s, x, y, w, h, items, o){
  o = o || {};
  const runs = [];
  items.forEach((it, i) => {
    const last = i === items.length-1;
    if (Array.isArray(it)) {
      it.forEach((r, j) => runs.push({ text:r.text,
        options:Object.assign({ bullet:j===0?{indent:14}:false, color:r.color||C.white,
          bold:r.bold||false, breakLine:j===it.length-1 }, {}) }));
    } else {
      runs.push({ text:it, options:{ bullet:{indent:14}, color:C.white, breakLine:!last } });
    }
  });
  s.addText(runs, { x, y, w, h, fontFace:BODY, fontSize:o.fs||13.5, color:C.white,
    paraSpaceAfter:o.gap!=null?o.gap:10, lineSpacingMultiple:1.05, valign:"top", margin:0 });
}
function chip(s, x, y, w, txt, fill, txtColor){
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h:0.34, rectRadius:0.17,
    fill:{color:fill}, line:{type:"none"} });
  s.addText(txt, { x, y, w, h:0.34, align:"center", valign:"middle", fontFace:BODY,
    fontSize:9.5, bold:true, color:txtColor||C.bg, margin:0 });
}
// styled table
function table(s, rows, x, y, w, colW, o){
  o = o || {};
  s.addTable(rows, { x, y, w, colW,
    border:{ type:"solid", pt:0.75, color:C.line },
    fontFace:BODY, fontSize:o.fs||11.5, color:C.white, valign:"middle", align:"left",
    rowH:o.rowH||0.52, margin:[3,5,3,5], autoPage:false });
}
function hcell(t){ return { text:t, options:{ fill:{color:C.cyan}, color:C.bg, bold:true, fontFace:BODY } }; }
function cell(t, opt){ return { text:t, options:Object.assign({}, opt||{}) }; }

// ============================================================
// SLIDE 1 — Title
// ============================================================
{
  const s = pres.addSlide(); slideBg(s);
  s.addText("ADVISOR MEETING  ·  MAY 22, 2026", { x:0, y:1.15, w:W, h:0.4,
    align:"center", fontFace:BODY, fontSize:13, color:C.cyan, bold:true, charSpacing:3 });
  s.addText("Longitudinal & Generative Foundation Models\nfor 3D Medical Imaging", {
    x:0.5, y:1.95, w:W-1, h:1.9, align:"center", fontFace:HEAD, fontSize:40, bold:true,
    color:C.white, lineSpacingMultiple:1.05 });
  s.addText("A Research-Direction Survey & Proposal", { x:0, y:3.95, w:W, h:0.5,
    align:"center", fontFace:BODY, fontSize:20, color:C.mute });
  // timeline motif: 3 volume nodes + arrows
  const ty = 5.15, bw = 1.5, bh = 0.82, gap = 1.55;
  const x0 = (W - (3*bw + 2*gap))/2;
  ["Scan t1","Scan t2","Scan t3"].forEach((t,i)=>{
    const bx = x0 + i*(bw+gap);
    box(s, bx, ty, bw, bh, t, { fill:C.panel2, fs:11, color:C.cyan });
    if(i<2) aR(s, bx+bw+0.18, ty+bh/2, gap-0.36);
  });
  label(s, x0, ty+bh+0.12, 3*bw+2*gap, "one patient = an irregular sequence of 3D volumes",
    { fs:11, italic:true, color:C.mute });
  s.addText("Songlin Zhao", { x:0, y:6.55, w:W, h:0.4, align:"center", fontFace:BODY,
    fontSize:14, color:C.white, bold:true });
}

// ============================================================
// SLIDE 2 — Agenda
// ============================================================
{
  const s = page(2); head(s, 2, "Overview", "Overview", "Four Directions on the Table");
  const items = [
    ["1","TimeFM-3D","Longitudinal 3D imaging foundation model","MAIN LINE — DETAILED",C.green,true],
    ["2","Missing-data VLLM","Treating missing modality as a signal","SURVEYED",C.cyan,false],
    ["3","Diffusion-as-FM","A generative model reused as the backbone","SURVEYED",C.cyan,false],
    ["4","Causal VLLM","Counterfactual reasoning over imaging","BRIEF — NOT OUR STRENGTH",C.amber,false],
  ];
  let y = 1.78;
  items.forEach(it=>{
    const h = 1.12;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.82, y, w:11.7, h, rectRadius:0.08,
      fill:{color:it[5]?C.panel2:C.card}, line:{color:it[5]?C.green:C.line, width:it[5]?2:1} });
    s.addShape(pres.shapes.OVAL, { x:1.05, y:y+0.26, w:0.6, h:0.6,
      fill:{color:it[5]?C.green:C.cyan}, line:{type:"none"} });
    s.addText(it[0], { x:1.05, y:y+0.26, w:0.6, h:0.6, align:"center", valign:"middle",
      fontFace:HEAD, fontSize:20, bold:true, color:C.bg, margin:0 });
    s.addText(it[1], { x:1.95, y:y+0.16, w:5.2, h:0.5, fontFace:HEAD, fontSize:18, bold:true,
      color:C.white, margin:0 });
    s.addText(it[2], { x:1.95, y:y+0.58, w:7.0, h:0.4, fontFace:BODY, fontSize:12.5,
      color:C.mute, margin:0 });
    chip(s, 9.35, y+0.39, 3.0, it[3], it[4]);
    y += h + 0.16;
  });
}

// ============================================================
// SLIDE 3 — How we got here (funnel)
// ============================================================
{
  const s = page(3); head(s, 3, "Overview", "Overview", "From Three Suggestions to One Converged Line");
  const cx = W/2;
  const rows = [
    { w:9.6, t:"Advisor's three directions:  dynamic  ·  causal  ·  missing-data", fill:C.panel2, c:C.cyan },
    { w:7.4, t:"6 brainstorm rounds  ·  40+ candidate directions  ·  multi-round literature surveys", fill:C.panel, c:C.white },
    { w:5.0, t:"TimeFM-3D  +  near neighbors", fill:C.panel2, c:C.amber },
  ];
  let y = 2.0;
  rows.forEach((r,i)=>{
    box(s, cx-r.w/2, y, r.w, 0.92, r.t, { fill:r.fill, color:r.c, fs:i===2?14:12.5, bold:i===2,
      line:i===2?C.amber:C.cyan });
    if(i<2) aD(s, cx, y+0.92+0.06, 0.5);
    y += 0.92 + 0.62;
  });
  s.addText([
    { text:"Honest read:  ", options:{ bold:true, color:C.amber } },
    { text:"the search has converged. Further divergence has near-zero marginal value — the bottleneck is now committing and running experiments, not finding more directions.", options:{ color:C.white } }
  ], { x:1.4, y:5.95, w:10.5, h:0.8, fontFace:BODY, fontSize:12.5, align:"center",
       valign:"middle", lineSpacingMultiple:1.1 });
}

// ============================================================
// SLIDE 4 — The clinical problem
// ============================================================
{
  const s = page(4); head(s, 4, "Direction 1 · TimeFM-3D", "Direction 1 · TimeFM-3D",
    "Patients Are Sequences, Not Snapshots");
  bullets(s, 0.82, 1.85, 6.0, 3.2, [
    [{text:"A follow-up is a ", }, {text:"trajectory", bold:true, color:C.cyan}, {text:" of 3D CT/MRI over time."}],
    [{text:"Intervals are ", }, {text:"irregular", bold:true, color:C.cyan}, {text:" — 3 mo, 7 mo, 14 mo."}],
    [{text:"The clinical question is always about ", }, {text:"change", bold:true, color:C.amber},
     {text:":  progressing?  responding?  recurring?"}],
    [{text:"A single scan cannot answer it — the signal lives ", }, {text:"between", bold:true, color:C.amber},
     {text:" timepoints."}],
  ], { fs:14, gap:14 });
  // schematic: patient timeline with 3 volumes, lesion growing
  const px = 7.35, bw = 1.4, bh = 1.5, gap = 0.55;
  ["Baseline","+6 months","+14 months"].forEach((t,i)=>{
    const bx = px + i*(bw+gap);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:bx, y:2.7, w:bw, h:bh, rectRadius:0.07,
      fill:{color:C.panel2}, line:{color:C.cyan,width:1.25} });
    // lesion: growing dot
    const r = 0.16 + i*0.13;
    s.addShape(pres.shapes.OVAL, { x:bx+bw/2-r/2, y:2.7+bh/2-r/2, w:r, h:r,
      fill:{color:C.amber}, line:{type:"none"} });
    label(s, bx, 2.7+bh+0.07, bw, t, { fs:10, color:C.mute });
    if(i<2) aR(s, bx+bw+0.12, 2.7+bh/2, gap-0.24);
  });
  label(s, px, 2.32, 3*bw+2*gap, "Same patient — a brain metastasis followed over time",
    { fs:11, italic:true, color:C.cyan, bold:true });
  label(s, px, 4.55, 3*bw+2*gap, "(schematic — lesion enlarging across visits)",
    { fs:9.5, italic:true, color:C.mute });
}

// ============================================================
// SLIDE 5 — Gap in today's FMs
// ============================================================
{
  const s = page(5); head(s, 5, "Direction 1 · TimeFM-3D", "Direction 1 · TimeFM-3D",
    "Current Foundation Models See One Timepoint");
  // left: existing
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.82, y:1.95, w:5.7, h:4.6, rectRadius:0.08,
    fill:{color:C.card}, line:{color:C.line,width:1} });
  label(s, 0.82, 2.12, 5.7, "TODAY'S 3D MEDICAL FMs", { fs:12, bold:true, color:C.mute });
  box(s, 2.4, 2.6, 2.5, 0.9, "single 3D volume", { fs:11, fill:C.panel2 });
  aD(s, 3.65, 3.56, 0.4);
  box(s, 2.4, 4.02, 2.5, 0.8, "encoder", { fs:11, fill:C.panel });
  aD(s, 3.65, 4.88, 0.4);
  box(s, 2.4, 5.34, 2.5, 0.58, "embedding", { fs:10, fill:C.panel });
  label(s, 0.82, 6.06, 5.7, "Merlin · CT-CLIP · CT-FM · RadFM · M3FM", { fs:10, italic:true, color:C.mute });
  // right: missing
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:6.82, y:1.95, w:5.7, h:4.6, rectRadius:0.08,
    fill:{color:C.panel2}, line:{color:C.amber,width:1.6} });
  label(s, 6.82, 2.15, 5.7, "WHAT IS MISSING", { fs:12, bold:true, color:C.amber });
  ["t1","t2","t3"].forEach((t,i)=>{
    node(s, 7.1+i*1.62, 2.7, 1.3, 0.85, t, { fs:11, fill:C.card, line:C.cyan });
    if(i<2) aR(s, 7.1+i*1.62+1.33, 3.12, 0.27);
  });
  aD(s, 9.67, 3.62, 0.5);
  box(s, 8.4, 4.25, 2.5, 0.95, "?", { fs:24, bold:true, color:C.amber, fill:C.card, line:C.amber });
  label(s, 6.82, 5.4, 5.7, "No FM natively ingests the sequence itself —",
    { fs:11.5, color:C.white });
  label(s, 6.82, 5.66, 5.7, "the time axis is the untaken white space.",
    { fs:11.5, color:C.white, bold:true });
}

// ============================================================
// SLIDE 6 — Why a foundation model
// ============================================================
{
  const s = page(6); head(s, 6, "Direction 1 · TimeFM-3D", "Direction 1 · TimeFM-3D",
    "Why a Foundation Model — Pretrain Once, Transfer Everywhere");
  box(s, 1.1, 2.15, 3.4, 1.2, "Self-supervised pretraining\non large unlabeled scan archives",
    { fs:11.5, fill:C.panel2 });
  aR(s, 4.65, 2.75, 0.7);
  box(s, 5.5, 2.15, 3.0, 1.2, "Reusable\ntrajectory representation",
    { fs:12, bold:true, fill:C.panel2, line:C.amber, color:C.amber });
  // fan out
  const tasks = ["Disease-progression risk","Treatment response (RECIST)","Recurrence prediction","Longitudinal report generation"];
  tasks.forEach((t,i)=>{
    const ty = 1.78 + i*1.05;
    aDiag(s, 8.6, 2.75, 0.85, ty+0.4-2.75);
    box(s, 9.55, ty, 3.0, 0.8, t, { fs:10.5, fill:C.card, line:C.cyan });
  });
  label(s, 9.55, 6.05, 3.0, "one model  →  many clinical tasks", { fs:10.5, italic:true, color:C.cyan });
  bullets(s, 1.1, 4.0, 7.0, 2.6, [
    [{text:"Solves medical ", }, {text:"label scarcity", bold:true, color:C.cyan},
     {text:" — expert annotation is the real bottleneck."}],
    [{text:"One pretrained checkpoint ", }, {text:"transfers", bold:true, color:C.cyan},
     {text:" to many downstream tasks with little labeled data."}],
    [{text:"The time axis becomes ", }, {text:"free supervision", bold:true, color:C.amber},
     {text:" — no labels needed to learn change."}],
  ], { fs:13, gap:11 });
}

// ============================================================
// SLIDE 7 — Survey: longitudinal landscape (table)
// ============================================================
{
  const s = page(7); head(s, 7, "Direction 1 · TimeFM-3D", "Direction 1 · TimeFM-3D",
    "Survey — Who Else Is Working on This");
  const hl = { fill:{color:C.panel2}, color:C.amber };
  const rows = [
    [hcell("#"), hcell("Work"), hcell("Input"), hcell("Key limitation")],
    ["1","TTE Pretraining (Stanford)","single CT","timeline lives in labels; image is not a sequence"],
    ["2","SSL-AD","3D sequence","brain MRI only; ~3.2k patients; small"],
    ["3","CRONOS","multi-timepoint","a forecaster, not an FM; no text / EHR"],
    ["4","Temporal Flow Matching","3D sequence","generative, not a representation FM"],
    ["5","Merlin (Nature 2026)","single CT + EHR","image static; timeline in EHR labels"],
    [cell("6",hl), cell("BioViL-T / MAIRA-2 (Microsoft)",hl), cell("two chest X-rays",hl),
     cell("2D, not 3D  —  deep-dived next",hl)],
  ];
  table(s, rows, 0.82, 1.95, 11.7, [0.7,3.3,2.6,5.1], { fs:11.5, rowH:0.62 });
  s.addText([
    { text:"Nobody has shipped the full set:  ", options:{ bold:true, color:C.amber } },
    { text:"FM-scale + multi-organ + 3D sequence + interval-aware SSL + multimodal.", options:{ color:C.white } }
  ], { x:0.82, y:6.25, w:11.7, h:0.5, fontFace:BODY, fontSize:12.5 });
}

// ============================================================
// SLIDE 8 — Survey: maturity (table)
// ============================================================
{
  const s = page(8); head(s, 8, "Direction 1 · TimeFM-3D", "Direction 1 · TimeFM-3D",
    "Where the Field Is Saturated — and Where It Is Empty");
  const hl = { fill:{color:C.panel2}, color:C.amber, bold:true };
  const rows = [
    [hcell("Sub-area"), hcell("Maturity"), hcell("Representative work")],
    ["Single-timepoint 3D FM", cell("Saturated",{color:C.red}), "Merlin, CT-CLIP, CT-FM, RadFM, M3FM"],
    ["Single image + EHR-label timeline", cell("Taken (Stanford)",{color:C.red}), "TTE Pretraining"],
    ["2D longitudinal SSL", cell("Mature (mostly CXR)",{color:C.amber}), "BioViL-T, MAIRA-2, L-MAE"],
    [cell("3D longitudinal SSL",hl), cell("~ Empty — the gap",hl), cell("SSL-AD (brain-only, small)",hl)],
    ["3D longitudinal generation", cell("Heating up",{color:C.amber}), "BrLP, SADM, Temporal Flow Matching"],
  ];
  table(s, rows, 0.82, 1.95, 11.7, [4.2,3.4,4.1], { fs:12, rowH:0.7 });
  s.addText([
    { text:"3D longitudinal self-supervised learning is essentially empty.  ", options:{ bold:true, color:C.amber } },
    { text:"That is the opening.", options:{ color:C.white } }
  ], { x:0.82, y:6.35, w:11.7, h:0.5, fontFace:BODY, fontSize:12.5 });
}

// ============================================================
// SLIDE 9 — White space (2x2 matrix)
// ============================================================
{
  const s = page(9); head(s, 9, "Direction 1 · TimeFM-3D", "Direction 1 · TimeFM-3D",
    "TimeFM-3D — The Untaken Quadrant");
  const gx = 3.4, gy = 2.2, cw = 4.3, ch = 1.95, gp = 0.25;
  // axis labels
  s.addText("3D", { x:gx-1.0, y:gy+ch/2-0.3, w:0.9, h:0.6, align:"right", valign:"middle",
    fontFace:HEAD, fontSize:15, bold:true, color:C.cyan, margin:0 });
  s.addText("2D", { x:gx-1.0, y:gy+ch+gp+ch/2-0.3, w:0.9, h:0.6, align:"right", valign:"middle",
    fontFace:HEAD, fontSize:15, bold:true, color:C.mute, margin:0 });
  s.addText("single-timepoint", { x:gx, y:gy+2*ch+gp+0.12, w:cw, h:0.35, align:"center",
    fontFace:HEAD, fontSize:13, bold:true, color:C.mute, margin:0 });
  s.addText("longitudinal", { x:gx+cw+gp, y:gy+2*ch+gp+0.12, w:cw, h:0.35, align:"center",
    fontFace:HEAD, fontSize:13, bold:true, color:C.cyan, margin:0 });
  // cells: [col,row] row0=top(3D)
  function qcell(col,row,t1,t2,hot){
    const x = gx + col*(cw+gp), y = gy + row*(ch+gp);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w:cw, h:ch, rectRadius:0.07,
      fill:{color:hot?C.panel2:C.card}, line:{color:hot?C.amber:C.line, width:hot?2.25:1} });
    s.addText(t1, { x:x+0.1, y:y+0.32, w:cw-0.2, h:0.55, align:"center", fontFace:HEAD,
      fontSize:hot?17:13, bold:true, color:hot?C.amber:C.white, margin:0 });
    s.addText(t2, { x:x+0.1, y:y+0.92, w:cw-0.2, h:0.7, align:"center", fontFace:BODY,
      fontSize:hot?12:10.5, color:hot?C.white:C.mute, margin:0 });
  }
  qcell(0,0,"3D · single","Merlin, CT-FM, CT-CLIP",false);
  qcell(1,0,"TimeFM-3D","native 3D sequence · interval-aware SSL · multimodal · an FM",true);
  qcell(0,1,"2D · single","CT-CLIP-type encoders",false);
  qcell(1,1,"2D · longitudinal","BioViL-T",false);
}

// ============================================================
// SLIDE 10 — Deep-dive BioViL-T (image)
// ============================================================
{
  const s = page(10); head(s, 10, "Direction 1 · TimeFM-3D", "Direction 1 · TimeFM-3D",
    "Deep-Dive — BioViL-T (Microsoft, CVPR 2023)");
  // image right
  const ih = 4.15, iw = ih * (617/727);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:12.6-iw-0.2, y:1.92, w:iw+0.4, h:ih+0.36,
    rectRadius:0.05, fill:{color:"FFFFFF"}, line:{color:C.line,width:1} });
  s.addImage({ path:"figures/biovilt-fig1.png", x:12.6-iw, y:2.08, w:iw, h:ih });
  label(s, 12.6-iw-0.2, 1.92+ih+0.42, iw+0.4, "BioViL-T, Figure 1 (Microsoft, CVPR 2023)", { fs:9, italic:true, color:C.mute });
  // text left
  s.addText("The closest 2D longitudinal vision-language FM.", { x:0.82, y:1.95, w:5.6, h:0.5,
    fontFace:BODY, fontSize:13, bold:true, color:C.cyan, margin:0 });
  bullets(s, 0.82, 2.55, 5.7, 4.2, [
    [{text:"(a) ", color:C.amber, bold:true}, {text:"Prior VLP uses only a "},
     {text:"single image", bold:true}, {text:" for InfoNCE contrastive learning."}],
    [{text:"(b) ", color:C.amber, bold:true}, {text:"Discarding temporal links "},
     {text:"weakens image–text alignment", bold:true}, {text:" (see the affinity matrix)."}],
    [{text:"(c)(d) ", color:C.amber, bold:true}, {text:"BioViL-T adds the "},
     {text:"prior + current image", bold:true},
     {text:" and does spatiotemporal modelling."}],
    [{text:"It learns temporal phrases — "},
     {text:"“unchanged”, “worsening”", bold:true, color:C.cyan},
     {text:" — and reaches SOTA."}],
  ], { fs:12.5, gap:12 });
}

// ============================================================
// SLIDE 11 — BioViL-T limits
// ============================================================
{
  const s = page(11); head(s, 11, "Direction 1 · TimeFM-3D", "Direction 1 · TimeFM-3D",
    "BioViL-T Validates the Idea — in 2D");
  // left card: proves
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.82, y:1.95, w:5.7, h:4.45, rectRadius:0.08,
    fill:{color:C.card}, line:{color:C.green,width:1.4} });
  label(s, 0.82, 2.15, 5.7, "WHAT IT PROVES", { fs:12, bold:true, color:C.green });
  bullets(s, 1.15, 2.65, 5.1, 3.6, [
    [{text:"Temporal links are ", }, {text:"free extra supervision", bold:true, color:C.green}, {text:"."}],
    [{text:"Modelling change ", }, {text:"improves representations", bold:true}, {text:" and downstream SOTA."}],
    [{text:"The longitudinal premise is ", }, {text:"sound", bold:true, color:C.green},
     {text:" — empirically demonstrated."}],
  ], { fs:13, gap:13 });
  // right card: leaves open
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:6.82, y:1.95, w:5.7, h:4.45, rectRadius:0.08,
    fill:{color:C.panel2}, line:{color:C.amber,width:1.6} });
  label(s, 6.82, 2.15, 5.7, "WHAT IT LEAVES OPEN", { fs:12, bold:true, color:C.amber });
  bullets(s, 7.15, 2.65, 5.1, 3.6, [
    [{text:"Only ", }, {text:"2 timepoints", bold:true, color:C.amber}, {text:" (prior + current)."}],
    [{text:"Only ", }, {text:"2D chest X-ray", bold:true, color:C.amber}, {text:", one anatomy."}],
    [{text:"No ", }, {text:"3D volumes", bold:true, color:C.amber},
     {text:", no irregular Δt, no multi-organ, no multimodal fusion."}],
  ], { fs:13, gap:13 });
  s.addText([
    { text:"TimeFM-3D = ", options:{bold:true,color:C.cyan} },
    { text:"the same idea generalized to 3D · K timepoints · multi-organ · irregular intervals.", options:{color:C.white} }
  ], { x:0.82, y:6.5, w:11.7, h:0.35, fontFace:BODY, fontSize:11.5, align:"center" });
}

// ============================================================
// SLIDE 12 — Architecture
// ============================================================
{
  const s = page(12); head(s, 12, "Direction 1 · TimeFM-3D", "Direction 1 · TimeFM-3D",
    "TimeFM-3D — Native Multi-Timepoint 3D Encoder");
  const encCy = 3.5;
  // 3 volume boxes
  ["Volume t1","Volume t2","Volume t3"].forEach((t,i)=>{
    const vy = 2.0 + i*1.05;
    box(s, 0.82, vy, 1.55, 0.82, t, { fs:10, fill:C.panel2 });
    aDiag(s, 2.42, vy+0.41, 0.9, encCy-(vy+0.41));
  });
  label(s, 0.82, 5.18, 1.55, "irregular Δt", { fs:9.5, color:C.amber, italic:true });
  // encoder
  box(s, 3.4, 2.5, 2.0, 2.0, "3D Volume\nEncoder\n(shared weights)", { fs:11, fill:C.panel, bold:true });
  aR(s, 5.45, encCy, 0.5);
  // + Fourier(dt)
  s.addShape(pres.shapes.OVAL, { x:6.0, y:encCy-0.3, w:0.6, h:0.6, fill:{color:C.card}, line:{color:C.cyan,width:1.25} });
  s.addText("+", { x:6.0, y:encCy-0.3, w:0.6, h:0.6, align:"center", valign:"middle", fontFace:HEAD,
    fontSize:20, bold:true, color:C.cyan, margin:0 });
  node(s, 5.85, encCy+0.55, 0.9, 0.6, "Fourier\n(Δt)", { fs:8.5, fill:C.card, color:C.amber, line:C.amber });
  s.addShape(pres.shapes.LINE, { x:6.3, y:encCy+0.55, w:0, h:-0.25, line:{color:C.cyan,width:1.6,endArrowType:"triangle"} });
  aR(s, 6.7, encCy, 0.5);
  // temporal transformer
  box(s, 7.3, 2.5, 2.7, 2.0, "Temporal Transformer\n\nΔt-aware\ncross-visit attention",
    { fs:11.5, fill:C.panel2, line:C.amber, lw:2.25, bold:true, color:C.amber });
  aR(s, 10.05, encCy, 0.5);
  // trajectory embedding
  box(s, 10.6, 2.7, 1.95, 1.6, "Trajectory\nEmbedding", { fs:11.5, fill:C.panel, bold:true, color:C.cyan });
  // downstream: 1 -> 4 distributor
  const tCx = 11.575, busY = 4.85;
  aD(s, tCx, 4.32, busY-4.32-0.02);
  const centers = [6.1, 8.0, 9.9, 11.575];
  s.addShape(pres.shapes.LINE, { x:centers[0], y:busY, w:centers[3]-centers[0], h:0, line:{color:C.cyan,width:1.6} });
  const tasks = ["Risk","Treatment\nresponse","Recurrence","Report"];
  centers.forEach((cx,i)=>{
    aD(s, cx, busY, 0.34);
    node(s, cx-0.93, busY+0.37, 1.86, 0.68, tasks[i], { fs:9.5, fill:C.card, line:C.cyan });
  });
  label(s, 4.6, 6.18, 8.1, "one trajectory embedding  →  many downstream clinical tasks",
    { fs:10, italic:true, color:C.mute });
}

// ============================================================
// SLIDE 13 — Three SSL objectives
// ============================================================
{
  const s = page(13); head(s, 13, "Direction 1 · TimeFM-3D", "Direction 1 · TimeFM-3D",
    "How It Learns — Three Self-Supervised Objectives");
  const cards = [
    { tag:"IA-MVM", name:"Interval-Aware Masked Volume Modeling",
      desc:"Mask a volume in the sequence, reconstruct it from neighbors. Short Δt → higher mask ratio; long Δt → predict the delta." },
    { tag:"NVP-LS", name:"Next-Volume Prediction in Latent Space",
      desc:"Given V₁ … Vₖ₋₁, predict the latent of the next volume Vₖ — forecasting as a pretraining signal." },
    { tag:"CMTC", name:"Cross-Modal Temporal Contrast",
      desc:"Pair volume@t with its report / EHR window via InfoNCE; push other timepoints of the same patient apart." },
  ];
  const cw = 3.78, gp = 0.18, x0 = 0.82;
  cards.forEach((c,i)=>{
    const x = x0 + i*(cw+gp);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y:1.95, w:cw, h:4.75, rectRadius:0.08,
      fill:{color:C.card}, line:{color:C.line,width:1} });
    chip(s, x+0.3, 2.2, 1.5, c.tag, C.cyan);
    s.addText(c.name, { x:x+0.3, y:2.7, w:cw-0.6, h:1.0, fontFace:HEAD, fontSize:13.5,
      bold:true, color:C.white, margin:0 });
    // mini schematic band
    const my = 3.85;
    if(i===0){
      [0,1,2].forEach(k=>{
        const bx = x+0.42+k*1.0;
        s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:bx, y:my, w:0.82, h:0.6, rectRadius:0.05,
          fill:{color:k===1?C.bg:C.panel2}, line:{color:k===1?C.amber:C.cyan, width:k===1?1.6:1,
          dashType:k===1?"dash":"solid"} });
        s.addText(k===1?"mask":"V"+(k+1), { x:bx, y:my, w:0.82, h:0.6, align:"center",
          valign:"middle", fontFace:BODY, fontSize:9, color:k===1?C.amber:C.white, margin:0 });
      });
      s.addShape(pres.shapes.LINE, { x:x+0.42+0.82, y:my+0.3, w:1.0-0.82, h:0,
        line:{color:C.cyan,width:1.4} });
      s.addShape(pres.shapes.LINE, { x:x+0.42+1.82, y:my+0.3, w:1.0-0.82, h:0,
        line:{color:C.cyan,width:1.4} });
    } else if(i===1){
      [0,1,2].forEach(k=>{
        const bx = x+0.42+k*1.0;
        const pred = k===2;
        s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:bx, y:my, w:0.82, h:0.6, rectRadius:0.05,
          fill:{color:pred?C.bg:C.panel2}, line:{color:pred?C.amber:C.cyan, width:pred?1.6:1,
          dashType:pred?"dash":"solid"} });
        s.addText(pred?"Vₖ":"V"+(k+1), { x:bx, y:my, w:0.82, h:0.6, align:"center",
          valign:"middle", fontFace:BODY, fontSize:9, color:pred?C.amber:C.white, margin:0 });
        if(k<2) aR(s, bx+0.82, my+0.3, 0.18);
      });
    } else {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:x+0.55, y:my, w:1.0, h:0.6, rectRadius:0.05,
        fill:{color:C.panel2}, line:{color:C.cyan,width:1} });
      s.addText("volume@t", { x:x+0.55, y:my, w:1.0, h:0.6, align:"center", valign:"middle",
        fontFace:BODY, fontSize:8, color:C.white, margin:0 });
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:x+2.05, y:my, w:1.0, h:0.6, rectRadius:0.05,
        fill:{color:C.panel2}, line:{color:C.amber,width:1} });
      s.addText("report@t", { x:x+2.05, y:my, w:1.0, h:0.6, align:"center", valign:"middle",
        fontFace:BODY, fontSize:8, color:C.amber, margin:0 });
      s.addShape(pres.shapes.LINE, { x:x+1.55, y:my+0.3, w:0.5, h:0,
        line:{color:C.cyan,width:1.4,beginArrowType:"triangle",endArrowType:"triangle"} });
    }
    s.addText(c.desc, { x:x+0.3, y:4.7, w:cw-0.6, h:1.85, fontFace:BODY, fontSize:10.8,
      color:C.mute, margin:0, lineSpacingMultiple:1.08 });
  });
}

// ============================================================
// SLIDE 14 — Irregular dt
// ============================================================
{
  const s = page(14); head(s, 14, "Direction 1 · TimeFM-3D", "Direction 1 · TimeFM-3D",
    "Time Is Continuous and Irregular — Model It Explicitly");
  // timeline
  const tlY = 2.6, x0 = 1.4, x1 = 11.9;
  s.addShape(pres.shapes.LINE, { x:x0, y:tlY, w:x1-x0, h:0, line:{color:C.line,width:1.5} });
  const pts = [ {x:1.9,l:"visit 1"}, {x:4.1,l:"visit 2"}, {x:8.3,l:"visit 3"}, {x:11.2,l:"visit 4"} ];
  pts.forEach(p=>{
    s.addShape(pres.shapes.OVAL, { x:p.x-0.1, y:tlY-0.1, w:0.2, h:0.2, fill:{color:C.cyan}, line:{type:"none"} });
    label(s, p.x-0.6, tlY+0.16, 1.2, p.l, { fs:9.5, color:C.white });
  });
  [["Δt = 3 mo",(1.9+4.1)/2],["Δt = 13 mo",(4.1+8.3)/2],["Δt = 9 mo",(8.3+11.2)/2]].forEach(d=>{
    label(s, d[1]-0.9, tlY-0.42, 1.8, d[0], { fs:10, color:C.amber, bold:true });
  });
  // mechanism boxes
  box(s, 1.4, 3.7, 3.2, 1.1, "Time2Vec / Fourier\ncontinuous-time encoding", { fs:11, fill:C.panel2 });
  aR(s, 4.7, 4.25, 0.55);
  box(s, 5.35, 3.7, 3.2, 1.1, "injected into\npatch + visit tokens", { fs:11, fill:C.panel2 });
  aR(s, 8.65, 4.25, 0.55);
  box(s, 9.3, 3.7, 3.4, 1.1, "Δt-scaled attention\n(longer gap → weaker link)",
    { fs:11, fill:C.panel2, line:C.amber, color:C.amber, bold:true });
  bullets(s, 1.4, 5.25, 11.0, 1.5, [
    [{text:"Naive sequence models assume ", }, {text:"equal spacing", bold:true, color:C.red},
     {text:" — wrong for real follow-up."}],
    [{text:"We encode the ", }, {text:"absolute interval", bold:true, color:C.cyan},
     {text:" so 3 months and 13 months are not treated alike. Borrowed from CRONOS / TaViT."}],
  ], { fs:12.5, gap:9 });
}

// ============================================================
// SLIDE 15 — Reasoning post-training
// ============================================================
{
  const s = page(15); head(s, 15, "Direction 1 · TimeFM-3D", "Direction 1 · TimeFM-3D",
    "From Representation to Decision — Verifier-Guided Reasoning");
  // phase 1
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.82, y:1.95, w:11.7, h:1.65, rectRadius:0.08,
    fill:{color:C.card}, line:{color:C.line,width:1} });
  chip(s, 1.05, 2.2, 1.9, "PHASE 1 · SFT", C.cyan);
  box(s, 3.25, 2.35, 2.6, 0.9, "clinical reports", { fs:10.5, fill:C.panel2 });
  aR(s, 6.0, 2.8, 0.6);
  box(s, 6.75, 2.35, 2.6, 0.9, "extracted CoT trace", { fs:10.5, fill:C.panel2 });
  aR(s, 9.5, 2.8, 0.6);
  box(s, 10.25, 2.35, 2.05, 0.9, "<thinking>\n<answer>", { fs:10, fill:C.panel, color:C.cyan });
  // phase 2
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.82, y:3.85, w:11.7, h:1.95, rectRadius:0.08,
    fill:{color:C.panel2}, line:{color:C.amber,width:1.6} });
  chip(s, 1.05, 4.1, 2.4, "PHASE 2 · RL (GRPO)", C.amber);
  box(s, 3.25, 4.3, 2.2, 1.0, "sample K\nreasoning chains", { fs:10, fill:C.card });
  aR(s, 5.6, 4.8, 0.55);
  box(s, 6.3, 4.3, 2.7, 1.0, "verifier:\npathology · RECIST · mortality",
    { fs:9.5, fill:C.card, line:C.amber, color:C.amber, bold:true });
  aR(s, 9.15, 4.8, 0.55);
  box(s, 9.85, 4.3, 2.45, 1.0, "reward →\nupdate policy", { fs:10, fill:C.card });
  s.addText([
    { text:"Key:  ", options:{bold:true,color:C.amber} },
    { text:"the verifier is a ", options:{color:C.white} },
    { text:"real clinical outcome", options:{bold:true,color:C.cyan} },
    { text:" — not a GPT-4 judge. This sidesteps the “reasoning-evaluation” quagmire and hits 2026 hiring keywords (reasoning · post-training · GRPO).", options:{color:C.white} }
  ], { x:0.82, y:6.05, w:11.7, h:0.8, fontFace:BODY, fontSize:12, lineSpacingMultiple:1.1 });
}

// ============================================================
// SLIDE 16 — Data usable now
// ============================================================
{
  const s = page(16); head(s, 16, "Direction 1 · TimeFM-3D", "Direction 1 · TimeFM-3D",
    "Data We Can Start With");
  const hl = { fill:{color:C.panel2}, color:C.amber, bold:true };
  const rows = [
    [hcell("Dataset"), hcell("Patients"), hcell("TP"), hcell("Modality"), hcell("Access")],
    ["NLST","26,722 (LDCT arm)","3","chest LDCT","4–12 wk DUA"],
    ["ADNI 1/2/3/4","~3,500+","2–10+","brain MRI + PET","days"],
    ["OASIS-3","~1,378","multi","brain MRI","days"],
    ["AIBL / PPMI","~350 / ~400","3+","brain MRI","days"],
    [cell("Yale-Brain-Mets",hl), cell("1,430",hl), cell("mean 8",hl), cell("brain MRI",hl),
     cell("instant, no approval",hl)],
    [cell("CT-RATE",hl), cell("21,304 (~3–4k ≥2TP)",hl), cell("mostly 1",hl),
     cell("chest CT + reports",hl), cell("open",hl)],
  ];
  table(s, rows, 0.82, 1.95, 11.7, [2.7,2.9,1.2,3.0,1.9], { fs:11.5, rowH:0.6 });
  s.addText([
    { text:"Prototype starts on Yale-Brain-Mets ", options:{bold:true,color:C.amber} },
    { text:"— instant download, zero approval, and it is brain imaging (hits the interest filter).", options:{color:C.white} }
  ], { x:0.82, y:6.35, w:11.7, h:0.5, fontFace:BODY, fontSize:12 });
}

// ============================================================
// SLIDE 17 — Data possibly usable
// ============================================================
{
  const s = page(17); head(s, 17, "Direction 1 · TimeFM-3D", "Direction 1 · TimeFM-3D",
    "Data That Would Scale It Up — Pending Access");
  const hl = { fill:{color:C.panel2}, color:C.cyan, bold:true };
  const rows = [
    [hcell("Dataset"), hcell("Patients"), hcell("TP"), hcell("Note")],
    [cell("Mayo Clinic  (ours)",hl), cell("TBD",hl), cell("longitudinal",hl),
     cell("DUA in progress — the moat / unique multimodal cohort",hl)],
    ["UK Biobank repeat","~20k 2nd visit","2","paid DUA, 8–16 wk"],
    ["NACC-SCAN","54k+","multi","multi-center brain imaging"],
    ["ABCD","~11,800","≤4","adolescent brain, IRB-controlled"],
    ["INSPECT (Stanford)","19,438","mostly 1","CTPA + 5-yr EHR — evaluation gold-standard"],
    ["ISPY1/2 · LUMIERE · UPenn-GBM","small","4–7","treatment-response evaluation cohorts"],
  ];
  table(s, rows, 0.82, 1.95, 11.7, [3.3,2.4,1.3,4.7], { fs:11.5, rowH:0.6 });
  s.addText([
    { text:"Honest bottleneck:  ", options:{bold:true,color:C.amber} },
    { text:"the constraint is data access and curation, not compute — 20×H200 is already in hand.", options:{color:C.white} }
  ], { x:0.82, y:6.35, w:11.7, h:0.5, fontFace:BODY, fontSize:12 });
}

// ============================================================
// SLIDE 18 — Preliminary plan
// ============================================================
{
  const s = page(18); head(s, 18, "Direction 1 · TimeFM-3D", "Direction 1 · TimeFM-3D",
    "Preliminary Experiment & Timeline");
  const phases = [
    { m:"M1–3", t:"DUA + curation; reproduce Sybil / TTE / Merlin baselines; 100M prototype on Yale-Brain-Mets" },
    { m:"M4–6", t:"Full three-objective SSL (IA-MVM + NVP-LS + CMTC); scale up; ablations" },
    { m:"M7–9", t:"Reasoning post-training: SFT chain-of-thought, then GRPO with outcome verifier" },
    { m:"M10–12", t:"Full-data pretraining; downstream evaluation; scaling study; write paper" },
  ];
  let y = 2.05;
  phases.forEach((p,i)=>{
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.82, y, w:1.7, h:0.92, rectRadius:0.07,
      fill:{color:i===0?C.amber:C.panel2}, line:{color:i===0?C.amber:C.cyan,width:1.25} });
    s.addText(p.m, { x:0.82, y, w:1.7, h:0.92, align:"center", valign:"middle", fontFace:HEAD,
      fontSize:14, bold:true, color:i===0?C.bg:C.white, margin:0 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:2.75, y, w:9.75, h:0.92, rectRadius:0.07,
      fill:{color:C.card}, line:{color:C.line,width:1} });
    s.addText(p.t, { x:3.0, y, w:9.3, h:0.92, valign:"middle", fontFace:BODY, fontSize:11.5,
      color:C.white, margin:0 });
    if(i<3) aD(s, 1.67, y+0.92, 0.12);
    y += 0.92 + 0.14;
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.82, y:6.24, w:11.7, h:0.56, rectRadius:0.07,
    fill:{color:C.panel2}, line:{color:C.amber,width:1.3} });
  s.addText([
    { text:"Next month:  ", options:{bold:true,color:C.amber} },
    { text:"a runnable TimeFM-3D prototype on 20×H200, W&B-monitored.", options:{color:C.white} }
  ], { x:0.82, y:6.24, w:11.7, h:0.56, fontFace:BODY, fontSize:12, align:"center", valign:"middle" });
}

// ============================================================
// SLIDE 19 — Direction 2 intro
// ============================================================
{
  const s = page(19); head(s, 19, "Direction 2 · Missing-data VLLM", "Direction 2 · Missing-data VLLM",
    "Direction 2 — When Modalities Are Missing");
  bullets(s, 0.82, 1.95, 6.0, 3.0, [
    [{text:"The advisor's ", }, {text:"third direction", bold:true, color:C.cyan},
     {text:": a VLLM that handles missing data."}],
    [{text:"Real clinical data is ", }, {text:"never complete", bold:true, color:C.amber},
     {text:" — no PET ordered, an MRI sequence skipped, a report absent."}],
    [{text:"The question: what does an FM ", }, {text:"do", bold:true},
     {text:" when a modality is missing?"}],
  ], { fs:13.5, gap:14 });
  // schematic: modality cards, two missing
  const mods = [ {n:"CT",ok:true},{n:"MRI",ok:true},{n:"PET",ok:false},{n:"Report",ok:false} ];
  mods.forEach((m,i)=>{
    const x = 7.3 + (i%2)*2.6, y = 2.05 + Math.floor(i/2)*1.35;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w:2.3, h:1.1, rectRadius:0.07,
      fill:{color:m.ok?C.panel2:C.card}, line:{color:m.ok?C.cyan:C.red, width:1.4,
      dashType:m.ok?"solid":"dash"} });
    s.addText(m.n, { x, y, w:2.3, h:1.1, align:"center", valign:"middle", fontFace:HEAD,
      fontSize:15, bold:true, color:m.ok?C.white:C.red, margin:0 });
    if(!m.ok) s.addText("missing", { x, y:y+0.66, w:2.3, h:0.3, align:"center", fontFace:BODY,
      fontSize:9, italic:true, color:C.red, margin:0 });
  });
  aD(s, 9.65, 4.8, 0.4);
  box(s, 8.4, 5.3, 2.5, 0.85, "Foundation Model", { fs:11, fill:C.panel, bold:true });
  s.addText("?", { x:10.95, y:5.25, w:0.9, h:0.9, align:"center", valign:"middle", fontFace:HEAD,
    fontSize:30, bold:true, color:C.amber, margin:0 });
}

// ============================================================
// SLIDE 20 — Survey six sub-angles
// ============================================================
{
  const s = page(20); head(s, 20, "Direction 2 · Missing-data VLLM", "Direction 2 · Missing-data VLLM",
    "Survey — What Is Solved, What Is Open");
  const hl = { fill:{color:C.panel2}, color:C.amber, bold:true };
  const rows = [
    [hcell("Sub-angle"), hcell("Status")],
    ["Method landscape (masked modeling, missing-aware prompts)", cell("closed-set: largely solved",{color:C.mute})],
    ["Uncertainty / calibration", cell("taken — AECF (2025)",{color:C.red})],
    ["Cross-modal imputation", cell("red ocean — PSNR-chasing",{color:C.red})],
    [cell("MNAR / informative missingness / causal view",hl), cell("OPEN — the gap",hl)],
    ["Benchmark / evaluation", cell("MCAR assumption overstates robustness",{color:C.amber})],
    ["Generative MLLM × missing data (medical)", cell("half-empty",{color:C.amber})],
  ];
  table(s, rows, 0.82, 1.95, 11.7, [7.4,4.3], { fs:12, rowH:0.62 });
  s.addText([
    { text:"Six independent sub-surveys — five point to the same place:  ", options:{bold:true,color:C.amber} },
    { text:"non-random missingness.", options:{color:C.white} }
  ], { x:0.82, y:6.4, w:11.7, h:0.45, fontFace:BODY, fontSize:12.5 });
}

// ============================================================
// SLIDE 21 — White space: missingness as signal
// ============================================================
{
  const s = page(21); head(s, 21, "Direction 2 · Missing-data VLLM", "Direction 2 · Missing-data VLLM",
    "The Missing Pattern Itself Carries Information");
  // path 1
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.82, y:2.05, w:11.7, h:1.7, rectRadius:0.08,
    fill:{color:C.card}, line:{color:C.red,width:1.3} });
  chip(s, 1.05, 2.3, 2.5, "MCAR VIEW — TODAY", C.red);
  box(s, 4.0, 2.45, 2.5, 0.9, "modality missing", { fs:10.5, fill:C.panel });
  aR(s, 6.65, 2.9, 0.6);
  box(s, 7.4, 2.45, 2.3, 0.9, "= random noise", { fs:10.5, fill:C.panel, color:C.red });
  aR(s, 9.85, 2.9, 0.6);
  box(s, 10.6, 2.45, 1.7, 0.9, "drop it", { fs:10.5, fill:C.panel, color:C.red });
  // path 2
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.82, y:4.0, w:11.7, h:1.7, rectRadius:0.08,
    fill:{color:C.panel2}, line:{color:C.cyan,width:1.7} });
  chip(s, 1.05, 4.25, 2.6, "MNAR VIEW — OPEN", C.cyan);
  box(s, 4.0, 4.4, 2.5, 0.9, "modality missing", { fs:10.5, fill:C.card });
  s.addShape(pres.shapes.LINE, { x:6.65, y:4.85, w:0.6, h:0, line:{color:C.cyan,width:1.9,
    beginArrowType:"triangle"} });
  box(s, 7.4, 4.4, 2.7, 0.9, "← clinical decision", { fs:10.5, fill:C.card, color:C.cyan });
  aR(s, 10.25, 4.85, 0.5);
  box(s, 10.85, 4.4, 1.45, 0.9, "a signal", { fs:10.5, fill:C.card, color:C.cyan, bold:true });
  s.addText([
    { text:"No PET ordered  →  ", options:{color:C.mute,italic:true} },
    { text:"the physician already had low suspicion of metastasis.", options:{color:C.white,bold:true} },
    { text:"  The absence is informative.", options:{color:C.cyan} }
  ], { x:0.82, y:6.0, w:11.7, h:0.6, fontFace:BODY, fontSize:12.5, align:"center" });
}

// ============================================================
// SLIDE 22 — Collider bias
// ============================================================
{
  const s = page(22); head(s, 22, "Direction 2 · Missing-data VLLM", "Direction 2 · Missing-data VLLM",
    "Filling In Missing Modalities Can Inject Bias");
  // causal graph
  const gy = 2.5;
  s.addShape(pres.shapes.OVAL, { x:2.0, y:gy, w:2.0, h:1.0, fill:{color:C.panel2}, line:{color:C.cyan,width:1.3} });
  s.addText("disease", { x:2.0, y:gy, w:2.0, h:1.0, align:"center", valign:"middle", fontFace:BODY,
    fontSize:12, bold:true, color:C.white, margin:0 });
  s.addShape(pres.shapes.OVAL, { x:5.6, y:gy, w:2.0, h:1.0, fill:{color:C.panel2}, line:{color:C.amber,width:1.6} });
  s.addText("finding\n(collider)", { x:5.6, y:gy, w:2.0, h:1.0, align:"center", valign:"middle",
    fontFace:BODY, fontSize:11, bold:true, color:C.amber, margin:0 });
  s.addShape(pres.shapes.OVAL, { x:9.2, y:gy, w:2.0, h:1.0, fill:{color:C.panel2}, line:{color:C.cyan,width:1.3} });
  s.addText("missingness R", { x:9.2, y:gy, w:2.0, h:1.0, align:"center", valign:"middle",
    fontFace:BODY, fontSize:11, bold:true, color:C.white, margin:0 });
  aR(s, 4.05, gy+0.5, 1.5);
  s.addShape(pres.shapes.LINE, { x:7.65, y:gy+0.5, w:1.5, h:0, line:{color:C.cyan,width:1.9,
    beginArrowType:"triangle"} });
  bullets(s, 1.4, 4.05, 10.6, 2.3, [
    [{text:"Under MNAR, naive imputation = ", }, {text:"conditioning on a collider", bold:true, color:C.amber},
     {text:" → selection bias."}],
    [{text:"Hard-filling a tumor can ", }, {text:"fabricate diagnostic evidence", bold:true, color:C.red},
     {text:" that was never observed."}],
    [{text:"The fix is not better imputation — it is ", }, {text:"modeling the missingness mechanism", bold:true, color:C.cyan},
     {text:" itself."}],
  ], { fs:12.5, gap:11 });
}

// ============================================================
// SLIDE 23 — The catch
// ============================================================
{
  const s = page(23); head(s, 23, "Direction 2 · Missing-data VLLM", "Direction 2 · Missing-data VLLM",
    "The Honest Problem With This Direction");
  box(s, 5.4, 1.95, 2.55, 0.9, "VLLM with\nmissing data", { fs:11.5, bold:true, fill:C.panel2 });
  // fork
  aDiag(s, 6.0, 2.9, -2.2, 0.9);
  aDiag(s, 7.3, 2.9, 2.2, 0.9);
  // left branch
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:1.2, y:3.95, w:5.1, h:2.4, rectRadius:0.08,
    fill:{color:C.card}, line:{color:C.red,width:1.3} });
  label(s, 1.2, 4.15, 5.1, "SIMPLE VERSION", { fs:11.5, bold:true, color:C.red });
  s.addText("Robustness via random dropout.", { x:1.5, y:4.5, w:4.5, h:0.5, fontFace:BODY,
    fontSize:12, bold:true, color:C.white, margin:0 });
  s.addText("Well-trodden red ocean — no novelty left.", { x:1.5, y:4.95, w:4.5, h:0.8,
    fontFace:BODY, fontSize:11, color:C.mute, margin:0 });
  chip(s, 1.5, 5.75, 2.4, "DEAD END", C.red, C.white);
  // right branch
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:7.0, y:3.95, w:5.1, h:2.4, rectRadius:0.08,
    fill:{color:C.panel2}, line:{color:C.amber,width:1.6} });
  label(s, 7.0, 4.15, 5.1, "NOVEL VERSION", { fs:11.5, bold:true, color:C.amber });
  s.addText("MNAR · m-graph · collider-aware fusion.", { x:7.3, y:4.5, w:4.5, h:0.5,
    fontFace:BODY, fontSize:12, bold:true, color:C.white, margin:0 });
  s.addText("Genuine white space — but it requires causal theory.", { x:7.3, y:4.95, w:4.5,
    h:0.8, fontFace:BODY, fontSize:11, color:C.mute, margin:0 });
  chip(s, 7.3, 5.75, 4.2, "CONFLICTS WITH “NO CAUSAL THEORY”", C.amber, C.bg);
  label(s, 0.82, 6.55, 11.7, "This tension is unresolved — it needs the advisor's input, not more brainstorming.",
    { fs:11.5, italic:true, color:C.mute, align:"center" });
}

// ============================================================
// SLIDE 24 — Direction 2 verdict
// ============================================================
{
  const s = page(24); head(s, 24, "Direction 2 · Missing-data VLLM", "Direction 2 · Missing-data VLLM",
    "Where Direction 2 Stands");
  const hl = { fill:{color:C.panel2}, color:C.amber, bold:true };
  const rows = [
    [hcell("Option"), hcell("Scope"), hcell("Timeline"), hcell("Risk")],
    ["Fast","Missing-aware text prompt fed to an existing medical VLM","2–3 mo",
     cell("low novelty",{color:C.amber})],
    ["Benchmark","Realistic-missingness benchmark (ADNI / TCGA natural missingness)","3–4 mo",
     cell("medium",{color:C.amber})],
    [cell("High-ceiling",hl), cell("Full informative-missingness VLLM (needs causal)",hl),
     cell("8–12 mo",hl), cell("conflicts with “no causal”",{fill:{color:C.panel2},color:C.red,bold:true})],
  ];
  table(s, rows, 0.82, 1.95, 11.7, [1.9,5.6,1.8,2.4], { fs:11.5, rowH:0.74 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.82, y:5.35, w:11.7, h:1.05, rectRadius:0.08,
    fill:{color:C.panel2}, line:{color:C.amber,width:1.4} });
  s.addShape(pres.shapes.RECTANGLE, { x:0.82, y:5.35, w:0.1, h:1.05, fill:{color:C.amber}, line:{type:"none"} });
  s.addText([
    { text:"Verdict:  ", options:{bold:true,color:C.amber} },
    { text:"on hold — pending the advisor — ", options:{color:C.white,bold:true} },
    { text:"which version of “missing data” did he mean?", options:{color:C.cyan} }
  ], { x:1.2, y:5.35, w:11.0, h:1.05, fontFace:BODY, fontSize:13.5, valign:"middle" });
}

// ============================================================
// SLIDE 25 — Direction 3 intro
// ============================================================
{
  const s = page(25); head(s, 25, "Direction 3 · Diffusion-as-FM", "Direction 3 · Diffusion-as-FM",
    "Direction 3 — Can a Generative Model Be the Backbone?");
  // generator row
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.82, y:2.1, w:11.7, h:1.55, rectRadius:0.08,
    fill:{color:C.card}, line:{color:C.line,width:1} });
  label(s, 1.1, 2.3, 4.0, "DIFFUSION AS A GENERATOR", { fs:11, bold:true, color:C.mute, align:"left" });
  box(s, 5.0, 2.55, 1.8, 0.85, "noise", { fs:11, fill:C.panel });
  aR(s, 6.95, 2.97, 0.7);
  box(s, 7.8, 2.55, 2.4, 0.85, "diffusion model", { fs:10.5, fill:C.panel });
  aR(s, 10.35, 2.97, 0.7);
  box(s, 11.2, 2.55, 1.05, 0.85, "image", { fs:10, fill:C.panel });
  // representation row
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.82, y:3.95, w:11.7, h:1.85, rectRadius:0.08,
    fill:{color:C.panel2}, line:{color:C.amber,width:1.6} });
  label(s, 1.1, 4.15, 4.5, "DIFFUSION AS A REPRESENTATION", { fs:11, bold:true, color:C.amber, align:"left" });
  box(s, 3.0, 4.55, 1.8, 0.95, "image", { fs:11, fill:C.card });
  aR(s, 4.95, 5.02, 0.6);
  box(s, 5.65, 4.55, 2.8, 0.95, "frozen diffusion\nintermediate features",
    { fs:10, fill:C.card, color:C.amber, bold:true });
  aR(s, 8.6, 5.02, 0.6);
  box(s, 9.3, 4.55, 2.9, 0.95, "light head:\nsegment / detect / retrieve", { fs:9.5, fill:C.card });
  label(s, 0.82, 6.15, 11.7, "Mainstream FMs use contrastive / MAE objectives. A different route: reuse a trained generative model's features for perception.",
    { fs:11.5, italic:true, color:C.mute, align:"center" });
}

// ============================================================
// SLIDE 26 — Marigold idea
// ============================================================
{
  const s = page(26); head(s, 26, "Direction 3 · Diffusion-as-FM", "Direction 3 · Diffusion-as-FM",
    "Marigold — Repurposing Diffusion Features");
  bullets(s, 0.82, 2.0, 6.2, 3.4, [
    [{text:"Marigold ", bold:true, color:C.cyan}, {text:"(CVPR 2024) took a diffusion model pretrained on natural images."}],
    [{text:"Frozen, plus a light head, it does ", }, {text:"dense prediction", bold:true, color:C.amber},
     {text:" (e.g. depth) — beating specialized models."}],
    [{text:"The lesson: a ", }, {text:"generative prior", bold:true, color:C.cyan},
     {text:" is also a strong perception backbone."}],
    [{text:"The question: does this ", }, {text:"transfer to medical 3D", bold:true, color:C.amber},
     {text:"?"}],
  ], { fs:13, gap:13 });
  // schematic: vertical stack
  const sx = 8.35, sw = 3.7;
  const sboxes = [
    ["frozen diffusion U-Net", C.amber, true],
    ["multi-scale features", C.cyan, false],
    ["light task head", C.cyan, false],
    ["depth / segmentation / correspondence", C.white, false],
  ];
  let sy = 2.0;
  sboxes.forEach((b,i)=>{
    box(s, sx, sy, sw, 0.74, b[0], { fs:10, fill:i===0?C.panel2:C.card,
      line:i===0?C.amber:C.line, color:b[1], bold:i===0 });
    if(i<3) aD(s, sx+sw/2, sy+0.74, 0.26);
    sy += 0.74 + 0.26;
  });
  label(s, sx, sy+0.04, sw, "no task-specific pretraining needed", { fs:9.5, italic:true, color:C.cyan });
}

// ============================================================
// SLIDE 27 — Survey medical landscape
// ============================================================
{
  const s = page(27); head(s, 27, "Direction 3 · Diffusion-as-FM", "Direction 3 · Diffusion-as-FM",
    "Half-Empty, Not Empty");
  // occupancy map
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.82, y:2.0, w:7.4, h:2.5, rectRadius:0.08,
    fill:{color:C.panel2}, line:{color:C.red,width:1.4} });
  label(s, 0.82, 2.25, 7.4, "OCCUPIED", { fs:12, bold:true, color:C.red });
  s.addText([
    { text:"Li et al. (arXiv 2501.19265, Jan 2025)", options:{bold:true,color:C.white,breakLine:true} },
    { text:"frozen 3D medical diffusion → 3D CT organ segmentation.", options:{color:C.mute,breakLine:true} },
    { text:"Adjacent: DiffuGTS (CVPR 2025), LDAE.", options:{color:C.mute} },
  ], { x:1.1, y:2.65, w:6.9, h:1.7, fontFace:BODY, fontSize:11.5, lineSpacingMultiple:1.15, valign:"top" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:8.4, y:2.0, w:4.12, h:2.5, rectRadius:0.08,
    fill:{color:C.card}, line:{color:C.cyan,width:1.4} });
  label(s, 8.4, 2.25, 4.12, "STILL OPEN", { fs:12, bold:true, color:C.cyan });
  s.addText("Systematic head-to-head vs DINOv2 / MAE, across classification + retrieval, on CT and MRI.",
    { x:8.65, y:2.65, w:3.6, h:1.7, fontFace:BODY, fontSize:11.5, color:C.white,
      lineSpacingMultiple:1.15, valign:"top" });
  bullets(s, 0.82, 4.9, 11.7, 1.7, [
    [{text:"The core paradigm — frozen 3D medical diffusion as a backbone — ", },
     {text:"is already taken", bold:true, color:C.red}, {text:"."}],
    [{text:"What is left is a ", }, {text:"differentiating empirical study", bold:true, color:C.cyan},
     {text:", not a new paradigm."}],
  ], { fs:12.5, gap:9 });
}

// ============================================================
// SLIDE 28 — Direction 3 verdict
// ============================================================
{
  const s = page(28); head(s, 28, "Direction 3 · Diffusion-as-FM", "Direction 3 · Diffusion-as-FM",
    "Where Direction 3 Stands");
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.82, y:2.0, w:11.7, h:1.5, rectRadius:0.08,
    fill:{color:C.panel2}, line:{color:C.amber,width:1.4} });
  s.addText([
    { text:"Downgraded.  ", options:{bold:true,color:C.amber} },
    { text:"Not a new paradigm — a MICCAI-scale empirical study differentiating from 2501.19265. Modest as a standalone flagship.", options:{color:C.white} }
  ], { x:1.1, y:2.0, w:11.1, h:1.5, fontFace:BODY, fontSize:13, valign:"middle", lineSpacingMultiple:1.12 });
  // best fit schematic
  box(s, 1.6, 4.3, 2.8, 1.1, "Diffusion-as-FM\nprobe", { fs:11, fill:C.card, line:C.cyan });
  aR(s, 4.5, 4.85, 1.4);
  box(s, 6.1, 4.0, 3.3, 1.7, "TimeFM-3D", { fs:15, bold:true, fill:C.panel2, line:C.amber, color:C.amber });
  label(s, 4.4, 4.45, 1.6, "evaluation\nprobe", { fs:9.5, color:C.cyan, italic:true });
  s.addText("Best role: an evaluation probe / benchmarking component for the main line — not a separate project.",
    { x:9.6, y:4.0, w:3.0, h:1.7, fontFace:BODY, fontSize:11, color:C.white, valign:"middle",
      lineSpacingMultiple:1.15 });
}

// ============================================================
// SLIDE 29 — Direction 4 causal
// ============================================================
{
  const s = page(29); head(s, 29, "Direction 4 · Causal VLLM", "Direction 4 · Causal VLLM",
    "Direction 4 — Causal / Counterfactual VLLM");
  bullets(s, 0.82, 1.95, 6.0, 2.6, [
    [{text:"The advisor's ", }, {text:"second direction", bold:true, color:C.cyan}, {text:"."}],
    [{text:"Asks a ", }, {text:"counterfactual", bold:true, color:C.amber},
     {text:": what would the imaging look like under a different treatment?"}],
    [{text:"Fits Mayo's longitudinal cohort well in principle."}],
  ], { fs:13, gap:13 });
  // factual / counterfactual schematic
  box(s, 7.4, 3.0, 2.1, 0.95, "baseline scan", { fs:10.5, fill:C.panel2 });
  aDiag(s, 9.55, 3.3, 1.0, -0.85);
  aDiag(s, 9.55, 3.7, 1.0, 0.85);
  box(s, 10.65, 2.15, 2.0, 0.95, "treatment A\n→ observed", { fs:9.5, fill:C.card, line:C.cyan, color:C.cyan });
  box(s, 10.65, 3.95, 2.0, 0.95, "treatment B\n→ counterfactual", { fs:9.5, fill:C.card,
    line:C.amber, color:C.amber, dashType:"dash" });
  label(s, 7.4, 5.15, 5.25, "observed vs never-observed outcome", { fs:10, italic:true, color:C.mute });
}

// ============================================================
// SLIDE 30 — Direction 4 verdict
// ============================================================
{
  const s = page(30); head(s, 30, "Direction 4 · Causal VLLM", "Direction 4 · Causal VLLM",
    "Honest Assessment of Direction 4");
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.82, y:2.1, w:11.7, h:1.4, rectRadius:0.08,
    fill:{color:C.panel2}, line:{color:C.amber,width:1.4} });
  s.addText([
    { text:"Shelved.  ", options:{bold:true,color:C.amber} },
    { text:"Causal inference has a high theory barrier — confounding, identifiability, semi-parametric efficiency. Not our current strength.", options:{color:C.white} }
  ], { x:1.1, y:2.1, w:11.1, h:1.4, fontFace:BODY, fontSize:13, valign:"middle", lineSpacingMultiple:1.12 });
  bullets(s, 1.1, 3.95, 11.0, 2.4, [
    [{text:"We are upfront: ", }, {text:"we are not familiar with causal theory", bold:true, color:C.amber},
     {text:" and will not build on it as a foundation."}],
    [{text:"It could merge with Direction 2's m-graph — but that only ", },
     {text:"drags missing-data back into causal inference", bold:true, color:C.red}, {text:"."}],
    [{text:"Revisitable later; ", }, {text:"not a starting point", bold:true, color:C.cyan}, {text:"."}],
  ], { fs:12.5, gap:12 });
}

// ============================================================
// SLIDE 31 — Summary
// ============================================================
{
  const s = page(31); head(s, 31, "Synthesis", "Synthesis", "Four Directions — Side by Side");
  const hl = { fill:{color:C.panel2}, color:C.green, bold:true };
  const rows = [
    [hcell("Direction"), hcell("Verdict"), hcell("Why")],
    [cell("TimeFM-3D",hl), cell("main line",hl),
     cell("real white space; fits brain + multimodal; can start now",hl)],
    ["Missing-data VLLM", cell("on hold",{color:C.amber,bold:true}),
     "the novel version needs causal theory — a conflict"],
    ["Diffusion-as-FM", cell("downgraded",{color:C.amber,bold:true}),
     "core already occupied; good only as an evaluation probe"],
    ["Causal VLLM", cell("shelved",{color:C.amber,bold:true}),
     "high theory barrier; not our current strength"],
  ];
  table(s, rows, 0.82, 1.95, 11.7, [3.0,2.7,6.0], { fs:12.5, rowH:0.82 });
  s.addText([
    { text:"There is no second direction on par with TimeFM-3D.  ", options:{bold:true,color:C.green} },
    { text:"That is the genuine bottom line of 40+ surveyed directions.", options:{color:C.white} }
  ], { x:0.82, y:6.4, w:11.7, h:0.45, fontFace:BODY, fontSize:12.5 });
}

// ============================================================
// SLIDE 32 — Questions for advisor
// ============================================================
{
  const s = page(32); head(s, 32, "Synthesis", "Synthesis", "Three Things I Need to Confirm");
  const qs = [
    ["1","What is actually in Liu's project?","Does “building on it” hold up — or is it effectively from scratch?"],
    ["2","Which “missing data” did you mean?","Simple robustness has no novelty; the informative-missingness version needs causal theory."],
    ["3","Is “dynamic” exactly TimeFM-3D?","If yes — I start building immediately."],
  ];
  let y = 1.92;
  qs.forEach(q=>{
    const h = 1.3;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.82, y, w:11.7, h, rectRadius:0.08,
      fill:{color:C.panel2}, line:{color:C.cyan,width:1.3} });
    s.addShape(pres.shapes.OVAL, { x:1.1, y:y+0.33, w:0.64, h:0.64, fill:{color:C.cyan}, line:{type:"none"} });
    s.addText(q[0], { x:1.1, y:y+0.33, w:0.64, h:0.64, align:"center", valign:"middle", fontFace:HEAD,
      fontSize:19, bold:true, color:C.bg, margin:0 });
    s.addText(q[1], { x:2.05, y:y+0.17, w:10.2, h:0.5, fontFace:HEAD, fontSize:15.5, bold:true,
      color:C.white, margin:0 });
    s.addText(q[2], { x:2.05, y:y+0.65, w:10.4, h:0.55, fontFace:BODY, fontSize:11.5, color:C.mute, margin:0 });
    y += h + 0.16;
  });
  s.addText("These answers are worth more than another round of brainstorming.", { x:0.82, y:6.42,
    w:11.7, h:0.38, fontFace:BODY, fontSize:12, italic:true, color:C.amber, align:"center" });
}

// ============================================================
// SLIDE 33 — Next steps
// ============================================================
{
  const s = page(33); head(s, 33, "Synthesis", "Synthesis", "What I Will Do Next");
  const steps = [
    "Start Mayo DUA; download Yale-Brain-Mets and CT-RATE.",
    "Run a TimeFM-3D prototype within two weeks (IA-MVM + NVP-LS + CMTC) on 20×H200.",
    "Reproduce the Sybil / TTE / Merlin baselines.",
    "Decide the missing-data scope once the advisor answers the three questions.",
  ];
  let y = 2.05;
  steps.forEach((t,i)=>{
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.82, y, w:11.7, h:0.82, rectRadius:0.07,
      fill:{color:C.card}, line:{color:C.line,width:1} });
    s.addShape(pres.shapes.RECTANGLE, { x:0.82, y, w:0.1, h:0.82, fill:{color:C.cyan}, line:{type:"none"} });
    s.addShape(pres.shapes.OVAL, { x:1.15, y:y+0.16, w:0.5, h:0.5, fill:{color:C.panel2},
      line:{color:C.cyan,width:1.25} });
    s.addText(String(i+1), { x:1.15, y:y+0.16, w:0.5, h:0.5, align:"center", valign:"middle",
      fontFace:HEAD, fontSize:14, bold:true, color:C.cyan, margin:0 });
    s.addText(t, { x:1.95, y, w:10.3, h:0.82, valign:"middle", fontFace:BODY, fontSize:12.5,
      color:C.white, margin:0 });
    y += 0.82 + 0.14;
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.82, y:5.97, w:11.7, h:0.72, rectRadius:0.08,
    fill:{color:C.panel2}, line:{color:C.amber,width:1.4} });
  s.addText([
    { text:"The direction has converged.  ", options:{bold:true,color:C.amber} },
    { text:"Next is execution — and your answers to the three questions.", options:{color:C.white} }
  ], { x:0.82, y:5.97, w:11.7, h:0.72, fontFace:BODY, fontSize:12.5, align:"center", valign:"middle" });
}

pres.writeFile({ fileName: "presentation-2026-05-22.pptx" })
  .then(() => console.log("OK  ->  presentation-2026-05-22.pptx"))
  .catch(e => { console.error("FAIL", e); process.exit(1); });
