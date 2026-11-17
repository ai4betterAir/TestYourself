// Preserve the existing maths lesson and assignment URLs.
(()=>{const p=new URLSearchParams(location.search);if(['grade','year','topic','focus','mode','assignment'].some(key=>p.has(key))){const destination=new URL('maths-practice.html',location.href);destination.search=p.toString();destination.hash=location.hash;location.replace(destination.href);}})();
