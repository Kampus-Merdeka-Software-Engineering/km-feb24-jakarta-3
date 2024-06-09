    document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.feedbackContent').addEventListener('submit', function(e) {
        e.preventDefault();

        const feedback = document.getElementById('feedback').value;

        if (feedback.trim() === "") {
            alert("Please provide feedback before submitting.");
            return;
        }

        const wordCount = feedback.trim().split(/\s+/).length;
        if (wordCount > 100) {
            document.getElementById('feedbackError').textContent = "Feedback cannot exceed 100 words";
            return;
        }

        document.getElementById('popup').classList.add('show');
        document.getElementById('overlay').classList.add('show');

        setTimeout(() => {
            document.getElementById('popup').classList.remove('show');
            document.getElementById('overlay').classList.remove('show');
        }, 2000);

        document.getElementById('feedback').value = '';
        document.getElementById('feedbackError').textContent = '';
    });

    document.getElementById('feedback').addEventListener('input', function() {
        const feedback = this.value.trim();
        const wordCount = feedback.split(/\s+/).length;

        if (wordCount > 100) {
            document.getElementById('feedbackError').textContent = "Feedback cannot exceed 100 words";
        } else {
            document.getElementById('feedbackError').textContent = "";
        }
    });
});
