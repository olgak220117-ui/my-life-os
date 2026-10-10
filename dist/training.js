(() => {
  'use strict';
  // The source plan is immutable; actual set results are stored independently.
  const KEY = 'my-life-os-training-oct2026-v1';
  const APP_KEY = 'my-life-os-v1';
  const $ = s => document.querySelector(s);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const ex = (name, sets, reps, weight, mode='kg', note='') => ({name,sets,reps,weight,mode,note});
  const templates = [
    ['A','Грудь / квадрицепсы','Понедельник',[
      ['Barbell Bench Press',4,8],['Barbell Back Squat',4,8],['Incline DB Press (30°)',3,10,'pair'],['Leg Press (machine)',3,10],['Lat Pulldown',3,10],['Dumbbell Flyes',3,12,'pair'],['Standing Calf Raise',3,15]
    ]],
    ['B','Спина / задняя поверхность бедра','Среда',[
      ['Deadlift',4,6],['Barbell Row',4,8],['Pull-ups',3,8,'added'],['Leg Press lying (machine)',3,10],['Single-arm DB Row',3,10],['Barbell Curl',3,10,'pair'],['Seated Calf Raise',3,15]
    ]],
    ['C','Плечи / руки','Пятница',[
      ['Overhead Press (OHP)',4,8],['Bulgarian Split Squat',3,10,'pair','На каждую ногу'],['Cable Row',3,8],['Seated DB Press',3,10,'pair'],['Leg Extension',3,12],['Lateral Raises',3,12,'pair'],['Skull Crushers',3,10],['Hip Thrust',3,10]
    ]]
  ];
  const weights = [
    [[82,70,20,80,47.5,11,50],[72.5,70,2.5,80,26,16,30],[50,20,32.5,22,40,11,30,70]],
    [[84,72.5,22,82.5,50,12,52.5],[75,72.5,2.5,82.5,26,17,32.5],[52.5,22,35,24,42.5,11,32.5,72.5]],
    [[86,75,22,85,52.5,12,55],[77.5,75,5,85,28,18,35],[55,24,37.5,26,45,12,35,75]],
    [[77.5,67.5,20,80,50,11,52.5],[70,67.5,0,80,24,16,32.5],[50,20,35,22,42.5,11,27.5,72.5]]
  ];
  const dates=['2026-10-12','2026-10-19','2026-10-26','2026-11-02','2026-11-09'];
  const titles=['Поездка · гибкий график','Возвращение','Возврат к пиковым весам','Новый пик','Объёмная неделя'];
  const notes=[
    'Гибкий график: 0–2 тренировки. Две — цель, одна или ни одной тоже допустимо. По возможности сохраняй сон и белок. Веса примерно на 10% ниже недавних; не гонись за рекордами на незнакомом оборудовании. Вариант без зала — альтернатива, а не дополнительная обязательная тренировка.',
    'Пн — A, ср — B, пт — C. Остальные дни — отдых. Возврат к весам недели 6 предыдущего блока. Если в поездке не было тренировок, план всё равно остаётся таким же.',
    'Пн — A, ср — B, пт — C. Остальные дни — отдых. Веса соответствуют неделе 7 предыдущего блока: жим 84, присед 72.5, тяга 75, OHP 52.5 кг.',
    'Пн — A, ср — B, пт — C. Небольшие контролируемые прибавки. Если верхний подход даётся с трудом, повтори вес прошлой недели и отметь это в заметках. Подтягивания +5 кг — если 3×8 с +2.5 кг давались легко.',
    'Пн — A, ср — B, пт — C. Базовые упражнения переходят на большее число повторений с весом примерно на 10% легче. Следующий блок начинается с разгрузки.'
  ];
  const plan = dates.map((start,index)=>({index,start,title:titles[index],note:notes[index],workouts:[]}));
  plan[0].workouts=[
    {id:'gym1',name:'Тренировка 1 · Full Body',day:'Любой день с доступом в зал',exercises:[ex('Barbell Bench Press',3,8,72.5),ex('Barbell Back Squat',3,8,62.5),ex('Barbell Row',3,8,62.5),ex('Overhead Press (OHP)',3,8,45),ex('Lat Pulldown',3,10,45),ex('Barbell Curl',2,10,15,'pair'),ex('Standing Calf Raise',2,15,45)]},
    {id:'gym2',name:'Тренировка 2 · Full Body',day:'Через 2+ дня после тренировки 1, если получится',exercises:[ex('Deadlift',3,6,65),ex('Barbell Bench Press',2,8,70),ex('Pull-ups',3,8,0,'body'),ex('Leg Press (machine)',3,10,75),ex('Seated DB Press',3,10,20,'pair'),ex('Lateral Raises',2,12,10,'pair'),ex('Skull Crushers',2,10,27.5)]},
    {id:'fallback',name:'Без зала · 3 круга',day:'Отель / улица · 20–25 минут',optional:true,exercises:[ex('Push-ups',3,'max',0,'body','Максимум, оставляя 2 повторения в запасе'),ex('Bodyweight Squats / Split Squats',3,'15–20',0,'body'),ex('Pull-ups or Inverted Rows (if a bar exists)',3,'max',0,'body','Если есть перекладина'),ex('Plank',3,'45–60',0,'seconds','Секунды')]}];
  for(let w=1;w<5;w++) {
    plan[w].workouts=templates.map(([id,name,day,defs],wi)=>({id,name:`${id} · ${name}`,day,exercises:defs.map(([name,sets,reps,mode='kg',note=''],ei)=>{
      if(w===4) {
        const repOverrides=[[10,10,12,12,12,12,15],[8,10,10,12,12,10,15],[10,12,10,12,12,12,12,10]];
        reps=repOverrides[wi][ei];
        if((wi===0&&ei===6)||(wi===1&&ei===6)||(wi===2&&ei===7))sets=4;
        if(wi===2&&ei===6)name='Cable Tricep Pushdown';
        if(wi===1&&ei===2)mode='body';
      }
      return ex(name,sets,reps,weights[w-1][wi][ei],mode,note);
    })}));
  }
  let log;
  try {log=JSON.parse(localStorage.getItem(KEY))||{};}catch {log={};}
  log.results ||= {}; log.sessions ||= {}; log.notes ||= {};
  let currentWeek=Number.isInteger(log.selectedWeek)?Math.min(4,Math.max(0,log.selectedWeek)):Math.min(4,Math.max(0,Math.floor((Date.now()-new Date('2026-10-12T00:00:00').getTime())/604800000)));
  let currentWorkout=log.selectedWorkout||plan[currentWeek].workouts[0].id;
  const container=document.createElement('section');container.className='training-plan';container.id='trainingPlan';
  $('#screen-fitness .metrics-row').before(container);
  const key=(w,id,ei,si)=>`${w}:${id}:${ei}:${si}`;
  const sessionKey=()=>`${currentWeek}:${currentWorkout}`;
  const workout=()=>plan[currentWeek].workouts.find(x=>x.id===currentWorkout)||plan[currentWeek].workouts[0];
  const numericReps=e=>typeof e.reps==='number'?e.reps:'';
  const unit=e=>e.mode==='pair'?'кг ×2':e.mode==='added'?'добавочный кг':e.mode==='body'||e.mode==='seconds'?'добавочный кг':'кг';
  const weightLabel=e=>e.mode==='pair'?`${e.weight} кг ×2`:e.mode==='added'?`BW +${e.weight} кг`:e.mode==='body'||e.mode==='seconds'?'Свой вес':`${e.weight} кг`;
  function count(w=currentWeek,id=null){let done=0,total=0;plan[w].workouts.filter(x=>id?x.id===id:!x.optional).forEach(x=>x.exercises.forEach((e,ei)=>{for(let si=0;si<e.sets;si++){total++;if(log.results[key(w,x.id,ei,si)]?.done)done++;}}));return {done,total};}
  function persist(){log.selectedWeek=currentWeek;log.selectedWorkout=currentWorkout;try{localStorage.setItem(KEY,JSON.stringify(log));$('#trainingSaveStatus').textContent='Изменения сохранены на устройстве';}catch{$('#trainingSaveStatus').textContent='Не удалось сохранить: хранилище браузера недоступно';}}
  function dateLabel(w){const a=new Date(plan[w].start+'T12:00:00'),b=new Date(a);b.setDate(a.getDate()+6);return `${a.toLocaleDateString('ru-RU',{day:'numeric',month:'short'})} – ${b.toLocaleDateString('ru-RU',{day:'numeric',month:'short'})}`;}
  function render(){
    if(!plan[currentWeek].workouts.some(x=>x.id===currentWorkout))currentWorkout=plan[currentWeek].workouts[0].id;
    const w=plan[currentWeek],x=workout(),n=count(),s=count(currentWeek,currentWorkout);
    container.innerHTML=`<div class="training-top"><div><p class="eyebrow">Твой тренировочный блок</p><h2>Пять недель. Один подход за раз.</h2><p>12 октября – 15 ноября 2026 · план и фактические результаты</p></div><button class="training-export" id="trainingExport">Экспорт отметок</button></div>
      <div class="training-weeks" role="tablist" aria-label="Недели тренировочного плана">${plan.map((p,i)=>`<button class="training-week" role="tab" aria-selected="${i===currentWeek}" data-week="${i}"><strong>Неделя ${i+1}</strong><small>${dateLabel(i)}</small><small>${count(i).done}/${count(i).total} подходов</small></button>`).join('')}</div>
      <div class="glass-card training-summary"><h3>Неделя ${currentWeek+1} · ${escape(w.title)}</h3><p>${escape(w.note)}</p><div class="training-meter"><i style="width:${n.done/n.total*100}%"></i></div><span class="training-count">${n.done} из ${n.total} основных подходов выполнено${currentWeek===0?' · вариант без зала учитывается отдельно':''}</span></div>
      <div class="training-days" role="tablist" aria-label="Тренировки недели">${w.workouts.map(p=>`<button role="tab" aria-selected="${p.id===x.id}" data-workout="${p.id}">${escape(p.id==='fallback'?'Без зала':p.id==='gym1'?'Тренировка 1':p.id==='gym2'?'Тренировка 2':'Тренировка '+p.id)} · ${count(currentWeek,p.id).done}/${count(currentWeek,p.id).total}</button>`).join('')}</div>
      <article class="glass-card training-workout"><div class="training-workout-head"><div><h3>${escape(x.name)}</h3><small>${escape(x.day)} · ${dateLabel(currentWeek)}</small></div><span class="pill">${s.done}/${s.total} подходов</span></div>
      <p class="training-rule">Штанга: вес уже включает гриф 20 кг. Значения ×2 — вес одного снаряда, как в PDF. Для тренажёров — вес плит / стека. Галочка подставляет план; если сделал меньше, измени фактические значения.</p>
      ${x.exercises.map((e,ei)=>`<section class="training-exercise"><h4>${escape(e.name)}</h4><p class="training-target">План: ${e.sets} × ${escape(e.reps)}${e.mode==='seconds'?' сек':''} · ${weightLabel(e)}${e.note?' · '+escape(e.note):''}</p><div class="training-sets">${Array.from({length:e.sets},(_,si)=>{const k=key(currentWeek,x.id,ei,si),r=log.results[k]||{};return `<div class="training-set ${r.done?'complete':''}"><label class="training-check"><input type="checkbox" data-check="${k}" ${r.done?'checked':''} aria-label="Выполнено: ${escape(e.name)}, подход ${si+1}"></label><span>№${si+1}</span><label>${e.mode==='seconds'?'Секунды':'Повторения'}<input type="number" inputmode="numeric" min="0" max="9999" step="1" data-result="${k}" data-field="reps" value="${r.reps??''}" placeholder="${numericReps(e)||escape(e.reps)}" aria-label="${e.mode==='seconds'?'Секунды':'Повторения'}: ${escape(e.name)}, подход ${si+1}"></label><label>${unit(e)}<input type="number" inputmode="decimal" min="0" max="9999" step="any" data-result="${k}" data-field="weight" value="${r.weight??''}" placeholder="${e.weight}" aria-label="Вес: ${escape(e.name)}, подход ${si+1}"></label></div>`;}).join('')}</div></section>`).join('')}
      <label class="training-notes">Заметка к тренировке<textarea class="field" id="trainingNote" placeholder="Что не получилось, как себя чувствовал…">${escape(log.notes[sessionKey()]||'')}</textarea></label>
      <div class="training-footer"><span class="training-save-status" id="trainingSaveStatus">Все отметки сохраняются автоматически</span><button class="primary-btn" id="trainingFinish">${log.sessions[sessionKey()]?'Обновить запись в истории':'Записать тренировку в историю'}</button></div><span class="training-selection">В историю попадут только отмеченные подходы. Неполную тренировку тоже можно записать.</span></article>`;
    container.querySelectorAll('[data-week]').forEach(b=>b.onclick=()=>{currentWeek=+b.dataset.week;currentWorkout=plan[currentWeek].workouts[0].id;render();persist();});
    container.querySelectorAll('[data-workout]').forEach(b=>b.onclick=()=>{currentWorkout=b.dataset.workout;render();persist();});
    container.querySelectorAll('[data-check]').forEach(b=>b.onchange=()=>{const k=b.dataset.check,parts=k.split(':'),e=x.exercises[+parts[2]],r=log.results[k]||{};r.done=b.checked;if(r.done){if(r.reps==null&&numericReps(e)!=='')r.reps=e.reps;if(r.weight==null)r.weight=e.weight;}log.results[k]=r;persist();const y=window.scrollY;render();window.scrollTo(0,y);});
    container.querySelectorAll('[data-result]').forEach(input=>input.oninput=()=>{if(!input.validity.valid){$('#trainingSaveStatus').textContent='Введите число от 0 до 9999';return;}const r=log.results[input.dataset.result]||{};r[input.dataset.field]=input.value===''?null:Number(input.value);log.results[input.dataset.result]=r;persist();});
    $('#trainingNote').oninput=e=>{log.notes[sessionKey()]=e.target.value;persist();};
    $('#trainingFinish').onclick=finish;
    $('#trainingExport').onclick=()=>{const blob=new Blob([JSON.stringify({planId:'oct2026',exportedAt:new Date().toISOString(),...log},null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='my-life-os-training-results.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);};
  }
  function finish(){
    const x=workout(),n=count(currentWeek,currentWorkout),sk=sessionKey();
    if(!n.done){$('#trainingSaveStatus').textContent='Сначала отметь хотя бы один выполненный подход';return;}
    let app;
    try {app=JSON.parse(localStorage.getItem(APP_KEY))||{};}catch {app={};}
    app.fitness ||= {exercises:[],workouts:[]};app.fitness.workouts ||= [];
    const previous=app.fitness.workouts.find(w=>w.id==='plan-oct2026-'+sk);
    const now=new Date();
    const date=previous?.date||`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    const exercises=x.exercises.map((e,ei)=>{const setsLog=Array.from({length:e.sets},(_,si)=>({set:si+1,...log.results[key(currentWeek,x.id,ei,si)]})).filter(r=>r.done);return {exerciseId:e.name,name:e.name,sets:setsLog.length,reps:setsLog[0]?.reps??0,weight:Math.max(0,...setsLog.map(r=>r.weight??0)),setsLog};}).filter(e=>e.sets>0);
    const record={id:'plan-oct2026-'+sk,date,createdAt:previous?.createdAt||Date.now(),name:`Неделя ${currentWeek+1} · ${x.name}${n.done<n.total?' · частично':''}`,exercises,note:log.notes[sk]||'',planWeek:currentWeek+1,planWorkout:x.id};
    const index=app.fitness.workouts.findIndex(w=>w.id===record.id);if(index>=0)app.fitness.workouts[index]=record;else app.fitness.workouts.push(record);
    try{localStorage.setItem(APP_KEY,JSON.stringify(app));log.sessions[sk]={date,done:n.done};persist();window.dispatchEvent(new Event('training-saved'));render();$('#trainingSaveStatus').textContent='Тренировка записана в историю';}catch{$('#trainingSaveStatus').textContent='Не удалось сохранить тренировку';}
  }
  $('#startWorkoutBtn').textContent='Открыть тренировку →';
  $('#startWorkoutBtn').onclick=()=>container.scrollIntoView({behavior:'smooth',block:'start'});
  render();
})();
