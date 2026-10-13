document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const lessons = document.querySelectorAll('.lesson');
  const checkboxes = document.querySelectorAll('.exercise-checkbox');
  const progressBarFill = document.getElementById('progress-bar-fill');
  const progressText = document.getElementById('progress-text');

  // Load progress from localStorage
  const loadProgress = () => {
    const savedProgress = JSON.parse(localStorage.getItem('es_progress')) || {};
    let completedCount = 0;

    checkboxes.forEach(checkbox => {
      const lessonId = checkbox.dataset.lesson;
      if (savedProgress[lessonId]) {
        checkbox.checked = true;
        completedCount++;
        // Optionally mark the lesson as completed visually
        const lessonElement = document.getElementById(lessonId);
        if (lessonElement) {
            lessonElement.classList.add('is-completed');
        }
      } else {
        checkbox.checked = false;
        const lessonElement = document.getElementById(lessonId);
        if (lessonElement) {
            lessonElement.classList.remove('is-completed');
        }
      }
    });

    updateProgressUI(completedCount);
  };

  // Save progress to localStorage
  const saveProgress = () => {
    const progress = {};
    let completedCount = 0;

    checkboxes.forEach(checkbox => {
      const lessonId = checkbox.dataset.lesson;
      progress[lessonId] = checkbox.checked;
      if (checkbox.checked) {
        completedCount++;
      }
    });

    localStorage.setItem('es_progress', JSON.stringify(progress));
    updateProgressUI(completedCount);
  };

  // Update progress bar and text
  const updateProgressUI = (completedCount) => {
    if (!progressBarFill || !progressText) return;
    const totalLessons = checkboxes.length;
    if (totalLessons === 0) return;

    const percentage = Math.round((completedCount / totalLessons) * 100);
    progressBarFill.style.width = `${percentage}%`;
    progressText.textContent = `${completedCount} von ${totalLessons} abgeschlossen (${percentage}%)`;

    // Accessibility for progress bar
    const progressContainer = document.querySelector('.progress-bar-bg');
    if (progressContainer) {
        progressContainer.setAttribute('aria-valuenow', percentage);
    }
  };

  // Toggle lesson content
  const setupLessonToggles = () => {
    lessons.forEach(lesson => {
      const header = lesson.querySelector('.lesson-header');
      const content = lesson.querySelector('.lesson-content');
      const toggleBtn = lesson.querySelector('.lesson-toggle');

      if (!header || !content || !toggleBtn) return;

      const toggleLesson = () => {
        const isOpen = lesson.classList.contains('is-open');

        // Close all other lessons (optional accordion style)
        // lessons.forEach(l => {
        //   l.classList.remove('is-open');
        //   l.querySelector('.lesson-toggle').setAttribute('aria-expanded', 'false');
        //   l.querySelector('.lesson-content').setAttribute('hidden', '');
        // });

        if (isOpen) {
          lesson.classList.remove('is-open');
          toggleBtn.setAttribute('aria-expanded', 'false');
          content.setAttribute('hidden', '');
        } else {
          lesson.classList.add('is-open');
          toggleBtn.setAttribute('aria-expanded', 'true');
          content.removeAttribute('hidden');
        }
      };

      header.addEventListener('click', toggleLesson);

      // Accessibility for toggle button
      toggleBtn.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent double triggering since header also has listener
          toggleLesson();
      });

      // Handle keyboard navigation for header
      header.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleLesson();
          }
      });
    });
  };

  // Setup Event Listeners
  const setupCheckboxes = () => {
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
          saveProgress();
          const lessonElement = document.getElementById(e.target.dataset.lesson);
          if (lessonElement) {
              if (e.target.checked) {
                  lessonElement.classList.add('is-completed');
              } else {
                  lessonElement.classList.remove('is-completed');
              }
          }
      });
    });
  };

  // Initialize
  if (lessons.length > 0 && checkboxes.length > 0) {
      setupLessonToggles();
      setupCheckboxes();
      loadProgress();

      // Open the first lesson by default if no progress
      const savedProgress = JSON.parse(localStorage.getItem('es_progress')) || {};
      if (Object.keys(savedProgress).length === 0) {
         const firstLesson = lessons[0];
         if (firstLesson) {
             firstLesson.classList.add('is-open');
             const toggleBtn = firstLesson.querySelector('.lesson-toggle');
             const content = firstLesson.querySelector('.lesson-content');
             if(toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
             if(content) content.removeAttribute('hidden');
         }
      }
  }
});
