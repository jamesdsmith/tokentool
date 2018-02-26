document.addEventListener('DOMContentLoaded', function(){
    var model = new TokenModel(),
        view = new TokenView(model),
        controller = new TokenController(model, view);
});
