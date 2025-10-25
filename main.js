// main.js - ShopinistaMeta Canva App (compact, single file)
// Registers edit_design:render and provides UI for importing feed & template
(function(){
  // ensure canva SDK presence
  function onReady(fn){
    if(typeof canva !== 'undefined' && canva && canva.on){
      fn();
    } else {
      window.addEventListener('message', function wait(e){
        if(e.data && (e.data.type === 'CANVA_INIT' || e.data.type === 'canva.init')){ 
          window.removeEventListener('message', wait);
          fn();
        }
      });
      // fallback small timeout
      setTimeout(function(){
        if(typeof canva !== 'undefined' && canva && canva.on) fn();
      }, 2000);
    }
  }

  onReady(function(){
    try{
      canva.on('edit_design:render', function(){
        // Avoid double render
        if(document.getElementById('shopinista-root')) return;
        var root = document.createElement('div');
        root.id = 'shopinista-root';
        root.style.cssText = 'font-family:Inter,Arial,sans-serif;padding:12px;background:#fafafa;color:#222;';

        root.innerHTML = '\
          <h2 style="margin:0 0 8px 0;font-size:18px;">ShopinistaMeta Canva App</h2>\
          <p style="margin:0 0 12px 0;font-size:13px;color:#444;">Import feed items or load a template to generate designs.</p>\
          <label style="display:block;margin-top:8px;font-size:12px;color:#333;">Template URL or ID</label>\
          <input id="si-template" type="text" placeholder="Paste template URL or ID" style="width:100%;padding:8px;border-radius:6px;border:1px solid #ddd;margin-top:6px;">\
          <button id="si-use-template" style="width:100%;margin-top:8px;padding:10px;border-radius:6px;border:none;background:#0077ff;color:#fff;cursor:pointer;">Load Template</button>\
          <hr style="margin:12px 0">\
          <label style="display:block;font-size:12px;color:#333;">Feed CSV or JSON</label>\
          <input id="si-feed" type="file" accept=".csv,.json" style="width:100%;margin-top:6px;">\
          <button id="si-process-feed" style="width:100%;margin-top:8px;padding:10px;border-radius:6px;border:none;background:#0a9d58;color:#fff;cursor:pointer;">Generate from Feed</button>\
          <div id="si-msg" style="margin-top:10px;font-size:13px;color:#444"></div>';

        document.body.innerHTML = '';
        document.body.appendChild(root);

        function setMsg(t){ var el=document.getElementById('si-msg'); if(el) el.textContent = t; }

        // Template handler (placeholder behaviour)
        document.getElementById('si-use-template').addEventListener('click', function(){
          var v = document.getElementById('si-template').value.trim();
          if(!v){ setMsg('Provide a template URL or ID.'); return; }
          setMsg('Template received. If supported, the app will duplicate/use it (placeholder).');
          // Real template duplication requires Connect API capability; for MVP we keep it as manual step.
        });

        // Feed processing
        document.getElementById('si-process-feed').addEventListener('click', async function(){
          var f = document.getElementById('si-feed').files[0];
          if(!f){ setMsg('Please choose a CSV or JSON file.'); return; }
          setMsg('Reading feed...');
          try{
            var text = await f.text();
            var rows = [];
            if(f.name.toLowerCase().endsWith('.json')) rows = JSON.parse(text);
            else rows = csvToArray(text);
            if(!Array.isArray(rows) || rows.length===0){ setMsg('No items found in feed.'); return; }
            setMsg('Parsed '+rows.length+' items. Starting generation (sample)...');
            var max = Math.min(rows.length, 20);
            for(var i=0;i<max;i++){
              var item = rows[i];
              // Example safe insert: insert title text and import image if provided
              if(item.title) {
                try{ await canva.design.insertText(String(item.title).slice(0,300)); }catch(e){}
              }
              if(item.imageUrl || item.image || item.img){
                var url = item.imageUrl || item.image || item.img;
                try{ await canva.design.importAsset({ type: 'IMAGE', url: String(url) }); }catch(e){}
              }
              setMsg('Processed '+(i+1)+'/'+rows.length);
            }
            setMsg('Batch finished. Check your design(s) in Canva.');
          }catch(err){
            console.error(err);
            setMsg('Error processing feed.');
          }
        });

        function csvToArray(csv){
          var lines = csv.split(/\r?\n/).filter(Boolean);
          if(lines.length<1) return [];
          var headers = lines[0].split(',').map(h=>h.trim());
          var out = [];
          for(var i=1;i<lines.length;i++){
            var vals = lines[i].split(',');
            var obj = {};
            for(var j=0;j<headers.length;j++) obj[headers[j]] = vals[j] ? vals[j].trim() : '';
            out.push(obj);
          }
          return out;
        }

      }); // end canva.on
    }catch(e){
      console.error('Shopinista main.js init error', e);
    }
  });
})();