document.addEventListener("DOMContentLoaded", () => {
  // ROLE CARD INFO
  const roleInfo = {
    "Investigative Journalist": {
      text: "You like digging deeper, following clues, and finding the truth that others might overlook.",
      traits: [
        "Curious and doesn’t give up easily",
        "Okay with working on something for a long time",
        "Good at researching and checking facts"
      ]
    },
    "News Reporter": {
      text: "You do well when things move fast and like telling people what’s happening as it unfolds.",
      traits: [
        "Stays calm under pressure",
        "Explains things clearly and quickly",
        "Likes being in the middle of the action"
      ]
    },
    "Feature Writer": {
      text: "You enjoy writing about people’s lives and feelings, and you like creating strong, detailed stories.",
      traits: [
        "Good at telling stories",
        "Notices details and understands people",
        "Likes writing longer pieces"
      ]
    },
    "Photojournalist": {
      text: "You notice moments that make great photos and want your pictures to tell the story.",
      traits: [
        "Thinks in pictures",
        "Okay with being out in different places",
        "Knows how to frame a shot and capture the right moment"
      ]
    },
    "Broadcast Journalist": {
      text: "You’re comfortable speaking on camera or on the radio and like sharing news with an audience.",
      traits: [
        "Speaks clearly and confidently",
        "Good with equipment and reading scripts",
        "Can react fast when things change"
      ]
    },
    "Data Journalist": {
      text: "You like working with numbers and finding patterns that help explain what’s going on.",
      traits: [
        "Thinks logically and carefully",
        "Likes charts and data tools",
        "Wants to understand how things work"
      ]
    }
  };

  const cards = document.querySelectorAll(".card");
  const roleDetails = document.getElementById("role-details");
  const roleTitle = document.getElementById("role-title");
  const roleText = document.getElementById("role-text");
  const roleTraits = document.getElementById("role-traits");

  cards.forEach(card => {
    card.querySelector(".more-btn").addEventListener("click", () => {
      const role = card.dataset.role;
      const info = roleInfo[role];

      roleTitle.textContent = role;
      roleText.textContent = info.text;
      roleTraits.innerHTML = "";
      info.traits.forEach(t => {
        const li = document.createElement("li");
        li.textContent = t;
        roleTraits.appendChild(li);
      });

      roleDetails.classList.remove("hidden");
      roleDetails.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  // QUIZ LOGIC
  const quizForm = document.getElementById("quiz-form");
  const quizResult = document.getElementById("quiz-result");
  const resultTitle = document.getElementById("result-title");
  const resultDescription = document.getElementById("result-description");
  const resetBtn = document.getElementById("reset-quiz");
  const pathText = document.getElementById("path-text");

  const roleDescriptions = {
    investigative: "Investigative Journalist — you want to uncover the truth and make sure people in power are being honest.",
    feature: "Feature Writer — you enjoy telling detailed stories that help people understand others’ lives.",
    photo: "Photojournalist — you tell stories by capturing strong and meaningful photos.",
    data: "Data Journalist — you explain things by finding patterns in data and numbers.",
    news: "News Reporter — you like fast-moving stories and keeping people updated.",
    broadcast: "Broadcast Journalist — you enjoy speaking on camera or radio and sharing news with viewers."
  };

  quizForm.addEventListener("submit", e => {
    e.preventDefault();

    const formData = new FormData(quizForm);
    const scores = {
      investigative: 0,
      feature: 0,
      photo: 0,
      data: 0,
      news: 0,
      broadcast: 0
    };

    for (const value of formData.values()) {
      if (scores[value] !== undefined) {
        scores[value] += 1;
      }
    }

    // Check if all questions answered
    const answered = Array.from(new Set([...formData.keys()])).length;
    const totalQuestions = 4;
    if (answered < totalQuestions) {
      alert("Please answer all questions before submitting the quiz.");
      return;
    }

    // Find best role
    let bestRole = null;
    let bestScore = -1;
    for (const role in scores) {
      if (scores[role] > bestScore) {
        bestScore = scores[role];
        bestRole = role;
      }
    }

    if (!bestRole) return;

    resultTitle.textContent = roleDescriptions[bestRole].split(" — ")[0];
    resultDescription.textContent = roleDescriptions[bestRole];
    quizResult.classList.remove("hidden");
    quizResult.scrollIntoView({ behavior: "smooth", block: "center" });

    pathText.textContent =
      "Based on your quiz result, you might enjoy paths like: " + roleDescriptions[bestRole];
  });

  resetBtn.addEventListener("click", () => {
    quizForm.reset();
    quizResult.classList.add("hidden");
    pathText.textContent = "Take the quiz to see personalized suggestions here.";
  });

  // FADE-IN ON SCROLL
  const faders = document.querySelectorAll(".fade-in");

  const appearOnScroll = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          appearOnScroll.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1
    }
  );

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });
});

