document.getElementById('ProfileImageUpload').addEventListener('change', function () {
    var input = this;
    var image = document.getElementById('ProfileImage');

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            image.src = e.target.result;
        };

        reader.readAsDataURL(input.files[0]);
    }
});
