console.log('PouchDB Access');

const { el, mount, unmount } = redom;
var currentpanel='login';
const divNavMenu=el('div',{id:'divNavMenu'},[
  el('button',{onclick:showLogin,textContent:'Login'}),
  el('button',{onclick:showSignUp,textContent:'Signup'}),
  //el('button',{onclick:showForgot,textContent:'Forgot'})
]);

const divLogin=el('form',{id:'divLogin',method:'post',action:'/'},[
  el('label',{textContent:'Login Section'}),
  el('br'),
  el('label',{textContent:'Alias'}),
  el('br'),
  el('input',{id:'alias',placeholder:'Username or Alias',name:'alias',value:'alias'}),
  el('br'),
  el('label',{textContent:'Passphrase'}),
  el('br'),
  el('input',{id:'passphrase', placeholder:'Passphrase or password',name:'passphrase',value:'pass'}),
  el('br'),
  el('input',{type:'hidden',name:'action', value:'login'}),
  el('br'),
  el('button',{textContent:'Submit'})
]);

const divSignUp=el('form',{id:'divSignUp',method:'post',action:'/'},[
  el('label',{textContent:'Sign Up Section'}),
  el('br'),
  el('label',{textContent:'Alias'}),
  el('br'),
  el('input',{name:'salias',id:'salias',placeholder:'Username or Alias',value:'alias'}),
  el('br'),
  el('label',{textContent:'Passphrase'}),
  el('br'),
  el('input',{name:'passphrase1',id:'spassphrase1', placeholder:'Passphrase or password',value:'pass'}),
  el('br'),
  el('label',{textContent:'Passphrase'}),
  el('br'),
  el('input',{name:'passphrase2',id:'spassphrase2', placeholder:'Passphrase or password',value:'pass'}),
  el('br'),
  el('input',{type:'hidden', name:'action', value:'register'}),
  el('br'),
  el('button',{textContent:'Register'})
]);

const divForgot=el('div',{id:'divForgot',method:'post',action:'/'},[
  el('label',{textContent:'Forgot Section'}),
  el('br'),
  el('label',{textContent:'Alias'}),
  el('br'),
  el('input',{name:'falias',id:'falias',placeholder:'Username or Alias',value:'alias'}),
  el('br'),
  el('label',{textContent:'Question 1:'}),
  el('br'),
  el('input',{name:'fquestion1',id:'fquestion1', placeholder:'Question1',value:'aliasq1'}),
  el('br'),
  el('label',{textContent:'Question 2:'}),
  el('br'),
  el('input',{name:'fquestion2',id:'fquestion2', placeholder:'Question2',value:'aliasq2'}),
  el('br'),
  el('label',{textContent:'Hint'}),
  el('br'),
  el('input',{name:'fhint',id:'fhint', placeholder:'hint'}),
  el('br'),
  el('input',{type:'hidden',id:'faction',name:'faction', value:'forgot'}),
  el('br'),
  el('button',{onclick:getHint,textContent:'Recovery'})
]);

const divDbPanel=el('div',{id:'divDbPanel'},[
  divNavMenu,
  divLogin,
  //divSignUp,
  //divForgot,
]);
mount(document.body, divDbPanel);

function hideDivs(){
  //try {
    if(currentpanel == 'login'){
      unmount(divDbPanel,divLogin);
    }
    if(currentpanel == 'signup'){
      unmount(divDbPanel,divSignUp);
    }
    if(currentpanel == 'forgot'){
      unmount(divDbPanel,divForgot);
    }
  //}catch(error){
    //console.log('ERROR!');
  //}
}

function showLogin(){
  console.log('btn event showLogin');
  hideDivs();
  currentpanel='login';
  mount(divDbPanel,divLogin);
}

function showSignUp(){
  console.log('btn event showSignUp!');
  hideDivs();
  currentpanel='signup';
  mount(divDbPanel,divSignUp);
}

function showForgot(){
  console.log('btn event showForgot');
  hideDivs();
  currentpanel='forgot';
  mount(divDbPanel,divForgot);
}

function getHint(){
  //let _form={
    //"alias":'test',
    //"question1":'test1',
    //"question2":'test2',
  //}
  //let formData = new FormData();
  ///formData.append('alias', 'alias');
  //formData.append('question1', 'test1');
  //formData.append('question2', 'test2');
  //formData.append('action', 'test2');

  let alias=document.getElementById('falias').value;
  let question1=document.getElementById('fquestion1').value;
  let question2=document.getElementById('fquestion2').value;
  //let fhint=document.getElementById('fhint').value;
  let action=document.getElementById('faction').value;

  fetch("/",{
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    //body: JSON.stringify(_form)
    //body: formData
    body:new URLSearchParams(`alias=${alias}&question1=${question1}&question2=${question2}&action=${action}`)
  })
  .then(response => response.json())
  .then(data => {
    console.log('PASS....');
    console.log(data);
  })
  .catch(err =>{
    console.error(err);
  });
}