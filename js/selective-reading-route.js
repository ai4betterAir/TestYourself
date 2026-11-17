// Keep existing Selective Reading bookmarks within the dedicated reading workspace.
(function(){
 const params=new URLSearchParams(location.search);
 if(params.get('stream')!=='reading'||params.get('exam')==='oc')return;
 params.delete('stream');
 if(!params.has('topic')&&params.get('view')!=='mock'&&!params.has('start'))params.set('start','1');
 location.replace('selective-reading-practice.html'+(params.size?'?'+params.toString():'')+location.hash);
})();
