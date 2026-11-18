const listings = [
  {id:'aster-house',name:'Aster House',city:'Bengaluru',area:'Koramangala · 5th Block',rent:12500,deposit:25000,room:'private',roomLabel:'Private room',gender:'women',genderLabel:'Women only',occupancy:'Single occupancy',rating:4.9,reviews:28,verified:true,meals:true,wifi:true,laundry:true,ac:true,available:'Ready from 1 Dec',accent:1,description:'A light-filled home on a leafy lane, close to cafés, daily essentials, and the places you go every day. Shared spaces are kept calm and cared for.',houseRules:'No smoking · Quiet hours after 10 pm',distance:'1.2 km to Forum Mall'},
  {id:'fern-corner',name:'Fern Corner',city:'Hyderabad',area:'Madhapur · Kavuri Hills',rent:10800,deposit:21600,room:'shared',roomLabel:'Twin sharing',gender:'women',genderLabel:'Women only',occupancy:'2 sharing',rating:4.8,reviews:19,verified:true,meals:true,wifi:true,laundry:true,ac:false,available:'Ready from 5 Dec',accent:2,description:'A friendly, sunlit shared home tucked into a residential lane. A relaxed common room and a small balcony make it easy to settle in.',houseRules:'No smoking · Visitors by arrangement',distance:'800 m to Metro station'},
  {id:'soma-stay',name:'Soma Stay',city:'Chennai',area:'Adyar · Gandhi Nagar',rent:9800,deposit:19600,room:'shared',roomLabel:'Twin sharing',gender:'women',genderLabel:'Women only',occupancy:'2 sharing',rating:4.7,reviews:16,verified:true,meals:true,wifi:true,laundry:false,ac:true,available:'Ready now',accent:3,description:'A breezy, well-connected place with a warm kitchen and bright shared spaces. Groceries, transit, and neighbourhood cafés are close by.',houseRules:'No smoking · Shared kitchen',distance:'1.5 km to IIT Madras'},
  {id:'city-nook',name:'The City Nook',city:'Mumbai',area:'Andheri East · Marol',rent:15500,deposit:31000,room:'private',roomLabel:'Private room',gender:'all',genderLabel:'All genders',occupancy:'Single occupancy',rating:4.8,reviews:32,verified:true,meals:false,wifi:true,laundry:true,ac:true,available:'Ready from 10 Dec',accent:4,description:'A quiet private room in a lively part of the city. The house has a shared lounge, secure entry, and quick connections to business districts.',houseRules:'No smoking · Secure entry',distance:'600 m to Marol Metro'},
  {id:'coast-house',name:'Coast House',city:'Mangaluru',area:'Deralakatte · University Road',rent:8200,deposit:16400,room:'shared',roomLabel:'Twin sharing',gender:'men',genderLabel:'Men only',occupancy:'2 sharing',rating:4.6,reviews:11,verified:false,meals:true,wifi:true,laundry:true,ac:false,available:'Ready from 3 Dec',accent:5,description:'A relaxed student home with a sunny terrace and simple, comfortable shared rooms. Campus, bus stops, and local food spots are an easy ride away.',houseRules:'No smoking · Student-friendly',distance:'1.1 km to campus'},
  {id:'terrace-house',name:'Terrace House',city:'Bengaluru',area:'HSR Layout · Sector 2',rent:14200,deposit:28400,room:'private',roomLabel:'Private room',gender:'all',genderLabel:'All genders',occupancy:'Single occupancy',rating:4.9,reviews:23,verified:true,meals:false,wifi:true,laundry:true,ac:true,available:'Ready from 15 Dec',accent:6,description:'A thoughtfully furnished room in a shared home with a plant-filled terrace. Great for someone who wants privacy and a little outdoor space.',houseRules:'No smoking · Terrace access',distance:'900 m to Agara Lake'},
  {id:'olive-nest',name:'Olive Nest',city:'Hyderabad',area:'Gachibowli · Botanical Garden Road',rent:17500,deposit:35000,room:'studio',roomLabel:'Private studio',gender:'all',genderLabel:'All genders',occupancy:'Single occupancy',rating:4.7,reviews:14,verified:true,meals:false,wifi:true,laundry:true,ac:true,available:'Ready now',accent:1,description:'A self-contained studio with a compact kitchenette and a small work corner. Designed for independent living with easy access to the tech corridor.',houseRules:'No smoking · Minimum 3 month stay',distance:'1 km to Botanical Garden'},
  {id:'marina-rooms',name:'Marina Rooms',city:'Chennai',area:'Thiruvanmiyur · East Coast Road',rent:11500,deposit:23000,room:'private',roomLabel:'Private room',gender:'men',genderLabel:'Men only',occupancy:'Single occupancy',rating:4.6,reviews:9,verified:false,meals:true,wifi:true,laundry:false,ac:false,available:'Ready from 8 Dec',accent:2,description:'An easy-going shared house with airy rooms and a generous dining area. Beach walks, local markets, and transit are all close at hand.',houseRules:'No smoking · Shared meals optional',distance:'1.3 km to beach'}
];

const cities = [
  {name:'Bengaluru',symbol:'ಬ',count:'2 STAYS'},
  {name:'Hyderabad',symbol:'है',count:'2 STAYS'},
  {name:'Chennai',symbol:'செ',count:'2 STAYS'},
  {name:'Mumbai',symbol:'मु',count:'1 STAY'},
  {name:'Mangaluru',symbol:'ಮಂ',count:'1 STAY'}
];
const money = value => `₹${Number(value).toLocaleString('en-IN')}`;
const grid = document.getElementById('property-grid');
const emptyState = document.getElementById('empty-state');
const locationInput = document.getElementById('location-input');
const budgetSelect = document.getElementById('budget-select');
const maxRent = document.getElementById('max-rent');
const dialog = document.getElementById('detail-dialog');
const compareDialog = document.getElementById('compare-dialog');
const toast = document.getElementById('toast');
let query = '';
let savedOnly = false;
let activeCity = '';
let toastTimer;
let saved = new Set(readSaved());
let compared = new Set(readCompared());

function readCompared(){
  try { const value=JSON.parse(localStorage.getItem('stayhub:compare')||'[]'); return Array.isArray(value)?value.filter(id=>listings.some(item=>item.id===id)).slice(0,3):[]; }
  catch { return []; }
}
function persistCompared(){
  try { localStorage.setItem('stayhub:compare',JSON.stringify([...compared])); } catch { /* Comparison remains available for this session. */ }
  updateCompareTray();
}

function readSaved(){
  try { const value=JSON.parse(localStorage.getItem('stayhub:saved')||'[]'); return Array.isArray(value)?value.filter(id=>typeof id==='string'):[]; }
  catch { return []; }
}
function persistSaved(){
  try { localStorage.setItem('stayhub:saved',JSON.stringify([...saved])); }
  catch { showToast('Saved for this session only.'); }
  updateSavedCount();
}
function updateSavedCount(){
  document.getElementById('saved-count').textContent=String(saved.size);
  document.getElementById('saved-nav').setAttribute('aria-pressed',String(savedOnly));
}
function artMarkup(item,detail=false){
  return `<div class="property-art scene-${item.accent}${detail?' detail-art':''}" aria-label="Illustration of the ${item.name} residence">
    <span class="art-sun"></span><span class="art-building"><span></span></span><span class="art-path"></span><span class="art-tree"></span>
    ${detail?'':`<span class="scene-index">STAYHUB · ${String(item.id.length).padStart(2,'0')}</span><span class="photo-note">A PLACE TO CALL YOURS</span>`}
  </div>`;
}
function cardMarkup(item){
  const isSaved=saved.has(item.id);
  const isCompared=compared.has(item.id);
  return `<article class="property-card" data-id="${item.id}">
    <div class="property-art-wrap">${artMarkup(item)}
      ${item.verified?'<span class="badge-verified"><b>✓</b> VERIFIED</span>':''}
      <button class="favorite-button${isSaved?' is-saved':''}" type="button" data-save="${item.id}" aria-label="${isSaved?'Remove':'Save'} ${item.name}" aria-pressed="${isSaved}">${isSaved?'♥':'♡'}</button>
    </div>
    <div class="property-body">
      <div class="property-meta"><span>${item.city.toUpperCase()} · ${item.roomLabel.toUpperCase()}</span><span class="rating"><b>★</b> ${item.rating.toFixed(1)} <span>(${item.reviews})</span></span></div>
      <div class="property-title-row"><h3>${item.name}</h3><div class="price">${money(item.rent)} <small>/ month</small></div></div>
      <p class="property-area">⌖ &nbsp;${item.area}</p>
      <div class="property-details"><span>${item.occupancy}</span><span>${item.distance}</span></div>
      <div class="card-bottom"><span class="gender-badge">${item.genderLabel.toUpperCase()}</span><div class="card-actions"><button class="compare-toggle${isCompared?' is-compared':''}" type="button" data-compare="${item.id}" aria-pressed="${isCompared}">${isCompared?'✓ Added':'Compare'}</button><button class="view-link" type="button" data-detail="${item.id}">VIEW STAY <span aria-hidden="true">↗</span></button></div></div>
    </div>
  </article>`;
}
function selectedValues(name){return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(input=>input.value);}
function filteredListings(){
  const search=(query||'').trim().toLowerCase();
  const gender=document.querySelector('input[name="gender"]:checked')?.value||'any';
  const rooms=selectedValues('room');
  const amenities=selectedValues('amenity');
  const ceiling=Math.min(Number(maxRent.value),budgetSelect.value==='any'?25000:Number(budgetSelect.value));
  let result=listings.filter(item=>{
    const matchesSearch=!search||`${item.city} ${item.area} ${item.name}`.toLowerCase().includes(search);
    const matchesCity=!activeCity||item.city===activeCity;
    const matchesBudget=item.rent<=ceiling;
    const matchesGender=gender==='any'||item.gender==='all'||item.gender===gender;
    const matchesRoom=!rooms.length||rooms.includes(item.room);
    const matchesAmenities=amenities.every(amenity=>item[amenity]);
    const matchesVerified=!document.getElementById('verified-only').checked||item.verified;
    const matchesSaved=!savedOnly||saved.has(item.id);
    return matchesSearch&&matchesCity&&matchesBudget&&matchesGender&&matchesRoom&&matchesAmenities&&matchesVerified&&matchesSaved;
  });
  const sort=document.getElementById('sort-select').value;
  if(sort==='price-asc') result.sort((a,b)=>a.rent-b.rent);
  if(sort==='price-desc') result.sort((a,b)=>b.rent-a.rent);
  if(sort==='rating') result.sort((a,b)=>b.rating-a.rating||b.reviews-a.reviews);
  return result;
}
function render(){
  const result=filteredListings();
  grid.innerHTML=result.map(cardMarkup).join('');
  emptyState.hidden=result.length!==0;
  grid.hidden=result.length===0;
  const count=result.length;
  document.getElementById('listing-count').textContent=String(count).padStart(2,'0');
  const description=savedOnly?'saved stays':query||activeCity||'sample stays';
  document.getElementById('results-summary').textContent=`${count} ${count===1?'place':'places'} · ${description}`;
  document.getElementById('results-endnote').textContent=count?`Showing all ${count} sample ${count===1?'stay':'stays'}.`:'Try widening your search.';
  document.querySelectorAll('.city-card').forEach(button=>{const active=button.dataset.city===activeCity;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active));});
  updateSavedCount();
  persistUrlState();
  updateCompareTray();
}
function renderCities(){
  document.getElementById('city-list').innerHTML=cities.map(city=>`<button class="city-card" type="button" data-city="${city.name}" aria-pressed="false"><span class="city-symbol" aria-hidden="true">${city.symbol}</span><span><small>${city.count}</small>${city.name}</span></button>`).join('');
}
function showToast(message){
  toast.textContent=message;toast.classList.add('is-visible');clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.classList.remove('is-visible'),2300);
}
function updateCompareTray(){
  const tray=document.getElementById('compare-tray');
  const count=compared.size;
  tray.hidden=count===0;
  document.getElementById('compare-count').textContent=`${count} ${count===1?'stay':'stays'} selected`;
  document.getElementById('compare-open').disabled=count<2;
}
function toggleCompare(id){
  if(compared.has(id)){compared.delete(id);showToast('Stay removed from comparison.');}
  else if(compared.size>=3){showToast('Compare up to three stays at a time.');return;}
  else{compared.add(id);showToast('Stay added to your comparison.');}
  persistCompared();render();
}
function compareValueRow(label,renderValue){
  return `<tr><th scope="row">${label}</th>${[...compared].map(id=>{const item=listings.find(stay=>stay.id===id);return `<td>${renderValue(item)}</td>`;}).join('')}</tr>`;
}
function openComparison(){
  const items=[...compared].map(id=>listings.find(stay=>stay.id===id)).filter(Boolean);
  if(items.length<2){showToast('Add at least two stays to compare.');return;}
  const cells=items.map(item=>`<th scope="col"><div class="compare-property"><div class="compare-art">${artMarkup(item,true)}</div><b>${item.name}</b><small>${item.city} · ${item.area}</small><button type="button" class="compare-remove" data-compare-remove="${item.id}">Remove</button></div></th>`).join('');
  const rows=[
    compareValueRow('Monthly rent',item=>`<strong>${money(item.rent)}</strong> / month`),
    compareValueRow('Move-in estimate',item=>`<strong>${money(item.rent+item.deposit)}</strong><small>First rent + deposit</small>`),
    compareValueRow('Deposit',item=>money(item.deposit)),
    compareValueRow('Room',item=>item.roomLabel),
    compareValueRow('Occupancy',item=>item.occupancy),
    compareValueRow('Availability',item=>item.available),
    compareValueRow('Rating',item=>`★ ${item.rating.toFixed(1)} <small>(${item.reviews} reviews)</small>`),
    compareValueRow('Who can stay',item=>item.genderLabel),
    compareValueRow('Verified',item=>item.verified?'✓ Reviewed':'Not marked'),
    compareValueRow('Amenities',item=>[['wifi','Wi‑Fi'],['meals','Meals'],['laundry','Laundry'],['ac','A/C']].filter(([key])=>item[key]).map(([,label])=>label).join(' · ')||'—')
  ].join('');
  document.getElementById('compare-content').innerHTML=`<div class="compare-scroll"><table class="compare-table"><thead><tr><th scope="col">DETAIL</th>${cells}</tr></thead><tbody>${rows}</tbody></table></div>`;
  if(!compareDialog.open)compareDialog.showModal();
}
function persistUrlState(){
  const url=new URL(window.location.href),params=new URLSearchParams();
  if(query.trim())params.set('q',query.trim());
  if(activeCity)params.set('city',activeCity);
  if(budgetSelect.value!=='any')params.set('budget',budgetSelect.value);
  if(Number(maxRent.value)<25000)params.set('rent',maxRent.value);
  const gender=document.querySelector('input[name="gender"]:checked')?.value||'any';
  if(gender!=='any')params.set('gender',gender);
  const rooms=selectedValues('room'),amenities=selectedValues('amenity');
  if(rooms.length)params.set('room',rooms.join(','));
  if(amenities.length)params.set('amenity',amenities.join(','));
  if(document.getElementById('verified-only').checked)params.set('verified','1');
  if(document.getElementById('sort-select').value!=='recommended')params.set('sort',document.getElementById('sort-select').value);
  url.search=params.toString();
  window.history.replaceState({},'',url);
}
function restoreUrlState(){
  const params=new URLSearchParams(window.location.search);
  query=params.get('q')||'';
  const city=params.get('city');
  activeCity=cities.some(item=>item.name===city)?city:'';
  locationInput.value=query||activeCity;
  const budget=params.get('budget');
  if([...budgetSelect.options].some(option=>option.value===budget))budgetSelect.value=budget;
  const rent=Number(params.get('rent'));
  if(Number.isFinite(rent)&&rent>=5000&&rent<=25000)maxRent.value=String(Math.round(rent/1000)*1000);
  document.getElementById('max-rent-label').textContent=money(maxRent.value);
  const gender=params.get('gender');
  if(['any','women','men'].includes(gender))document.querySelector(`input[name="gender"][value="${gender}"]`).checked=true;
  const rooms=(params.get('room')||'').split(',');
  const amenities=(params.get('amenity')||'').split(',');
  document.querySelectorAll('input[name="room"]').forEach(input=>input.checked=rooms.includes(input.value));
  document.querySelectorAll('input[name="amenity"]').forEach(input=>input.checked=amenities.includes(input.value));
  document.getElementById('verified-only').checked=params.get('verified')==='1';
  const sort=params.get('sort');
  if([...document.getElementById('sort-select').options].some(option=>option.value===sort))document.getElementById('sort-select').value=sort;
}
async function shareSearch(){
  const url=new URL(window.location.href);url.hash='listings';
  try{await navigator.clipboard.writeText(url.toString());showToast('Search link copied. Share this shortlist with a friend.');}
  catch{window.prompt('Copy your StayHub search link:',url.toString());}
}
function toggleSaved(id){
  const item=listings.find(stay=>stay.id===id);if(!item)return;
  if(saved.has(id)){saved.delete(id);showToast(`${item.name} removed from saved stays.`);}
  else{saved.add(id);showToast(`${item.name} saved for later.`);}
  persistSaved();render();
}
function openDetails(id){
  const item=listings.find(stay=>stay.id===id);if(!item)return;
  const amenities=[['wifi','Wi‑Fi'],['meals','Meals available'],['laundry','Laundry'],['ac','Air conditioning']].filter(([key])=>item[key]).map(([,label])=>`<span>${label}</span>`).join('');
  document.getElementById('detail-content').innerHTML=`<div class="detail-hero">${artMarkup(item,true)}</div><div class="detail-content"><div class="property-meta"><span>${item.city.toUpperCase()} · ${item.roomLabel.toUpperCase()}</span><span class="rating"><b>★</b> ${item.rating.toFixed(1)} <span>(${item.reviews} reviews)</span></span></div><div class="property-title-row"><h2 id="detail-title">${item.name}</h2><div class="price">${money(item.rent)} <small>/ month</small></div></div><p class="property-area">⌖ &nbsp;${item.area}</p><p class="property-description">${item.description}</p><div class="detail-highlights"><div class="detail-highlight"><small>ROOM</small><b>${item.roomLabel}</b></div><div class="detail-highlight"><small>OCCUPANCY</small><b>${item.occupancy}</b></div><div class="detail-highlight"><small>AVAILABLE</small><b>${item.available}</b></div></div><div class="detail-amenities">${amenities}</div><p class="property-description"><b>House notes:</b> ${item.houseRules}. <b>Deposit:</b> ${money(item.deposit)}.</p><section class="cost-estimator" data-rent="${item.rent}" data-deposit="${item.deposit}"><div class="estimator-head"><div><span class="filter-kicker">PLAN BEFORE YOU MOVE</span><h3>Estimate the cost</h3></div><label for="stay-length">Stay length<select id="stay-length" data-stay-length><option value="1">1 month</option><option value="3">3 months</option><option value="6" selected>6 months</option><option value="12">12 months</option></select></label></div><div class="cost-totals"><div><small>To move in</small><b data-upfront-cost>${money(item.rent+item.deposit)}</b><span>first rent + deposit</span></div><div><small>Full stay estimate</small><b data-stay-cost>${money(item.rent*6+item.deposit)}</b><span data-stay-label>6 months + deposit</span></div></div><p>Planning estimate only. Utilities and other fees are not included.</p></section><div class="detail-footer"><p>Sample listing · This demo doesn’t process bookings or payments.</p><button class="inquiry-button" type="button" data-inquiry="${item.id}">Ask about this stay <span aria-hidden="true">↗</span></button></div></div>`;
  dialog.showModal();document.body.classList.add('modal-open');
}
function resetFilters(){
  query='';activeCity='';savedOnly=false;locationInput.value='';budgetSelect.value='any';maxRent.value='25000';document.getElementById('max-rent-label').textContent=money(25000);document.getElementById('verified-only').checked=false;
  document.querySelector('input[name="gender"][value="any"]').checked=true;
  document.querySelectorAll('input[name="room"],input[name="amenity"]').forEach(input=>input.checked=false);
  document.getElementById('sort-select').value='recommended';document.querySelector('.filter-panel').classList.remove('is-open');render();
}

renderCities();document.getElementById('year').textContent=new Date().getFullYear();
restoreUrlState();render();
document.getElementById('search-form').addEventListener('submit',event=>{event.preventDefault();query=locationInput.value;activeCity='';document.getElementById('listings').scrollIntoView({behavior:'smooth'});render();});
locationInput.addEventListener('input',()=>{if(!locationInput.value){query='';activeCity='';render();}});
budgetSelect.addEventListener('change',render);
maxRent.addEventListener('input',()=>{document.getElementById('max-rent-label').textContent=money(maxRent.value);render();});
document.querySelectorAll('input[name="gender"],input[name="room"],input[name="amenity"]').forEach(input=>input.addEventListener('change',render));
document.getElementById('verified-only').addEventListener('change',render);
document.getElementById('sort-select').addEventListener('change',render);
document.getElementById('city-list').addEventListener('click',event=>{const button=event.target.closest('[data-city]');if(!button)return;activeCity=activeCity===button.dataset.city?'':button.dataset.city;query='';locationInput.value=activeCity;render();document.getElementById('listings').scrollIntoView({behavior:'smooth'});});
grid.addEventListener('click',event=>{const saveButton=event.target.closest('[data-save]');if(saveButton){toggleSaved(saveButton.dataset.save);return;}const compareButton=event.target.closest('[data-compare]');if(compareButton){toggleCompare(compareButton.dataset.compare);return;}const detailButton=event.target.closest('[data-detail]');if(detailButton)openDetails(detailButton.dataset.detail);});
document.getElementById('saved-nav').addEventListener('click',()=>{savedOnly=!savedOnly;activeCity='';query='';locationInput.value='';render();document.getElementById('listings').scrollIntoView({behavior:'smooth'});});
document.getElementById('reset-filters').addEventListener('click',resetFilters);
document.getElementById('empty-reset').addEventListener('click',resetFilters);
document.getElementById('mobile-filter').addEventListener('click',()=>document.querySelector('.filter-panel').classList.toggle('is-open'));
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
dialog.addEventListener('close',()=>document.body.classList.remove('modal-open'));
document.getElementById('detail-content').addEventListener('change',event=>{const control=event.target.closest('[data-stay-length]');if(!control)return;const estimator=control.closest('.cost-estimator'),months=Number(control.value),rent=Number(estimator.dataset.rent),deposit=Number(estimator.dataset.deposit);estimator.querySelector('[data-stay-cost]').textContent=money(rent*months+deposit);estimator.querySelector('[data-stay-label]').textContent=`${months} ${months===1?'month':'months'} + deposit`;});
document.getElementById('detail-content').addEventListener('click',event=>{const button=event.target.closest('[data-inquiry]');if(!button)return;const item=listings.find(stay=>stay.id===button.dataset.inquiry);dialog.close();showToast(`Demo only — ${item.name} is not accepting real inquiries.`);});
document.getElementById('share-search').addEventListener('click',shareSearch);
document.getElementById('compare-open').addEventListener('click',openComparison);
document.getElementById('compare-clear').addEventListener('click',()=>{compared.clear();persistCompared();render();});
document.getElementById('compare-content').addEventListener('click',event=>{const button=event.target.closest('[data-compare-remove]');if(!button)return;compared.delete(button.dataset.compareRemove);persistCompared();render();if(compared.size<2)compareDialog.close();else openComparison();});
document.querySelector('.compare-close').addEventListener('click',()=>compareDialog.close());
compareDialog.addEventListener('click',event=>{if(event.target===compareDialog)compareDialog.close();});
document.getElementById('location-input').addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();document.getElementById('search-form').requestSubmit();}});
