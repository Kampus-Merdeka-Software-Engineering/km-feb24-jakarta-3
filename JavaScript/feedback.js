document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.feedbackContent').addEventListener('submit', function(e) {
        e.preventDefault();

        // Get feedback value
        const feedback = document.getElementById('feedback').value;

        // Ensure feedback is not empty
        if (feedback.trim() === "") {
            alert("Please provide feedback before submitting.");
            return;
        }

        // Check word count
        const wordCount = feedback.trim().split(/\s+/).length;
        if (wordCount > 100) {
            document.getElementById('feedbackError').textContent = "Feedback cannot exceed 100 words";
            return;
        }

        // // Save feedback to local storage
        // let feedbackList = JSON.parse(localStorage.getItem('feedbackList')) || [];
        // feedbackList.push(feedback);
        // localStorage.setItem('feedbackList', JSON.stringify(feedbackList));

        // Show popup and overlay
        document.getElementById('popup').classList.add('show');
        document.getElementById('overlay').classList.add('show');

        // Hide popup after 2 seconds
        setTimeout(() => {
            document.getElementById('popup').classList.remove('show');
            document.getElementById('overlay').classList.remove('show');
        }, 2000);

        // Clear textarea and error message
        document.getElementById('feedback').value = '';
        document.getElementById('feedbackError').textContent = '';
    });

    // Check word count on input
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
