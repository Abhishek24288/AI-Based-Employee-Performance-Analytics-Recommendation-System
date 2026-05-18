const Candidate = require('../models/Candidate');

exports.matchCandidates = async (req, res) => {
  try {
    const { requiredSkills = [], preferredSkills = [], minExperience = 0 } = req.body;

    if (requiredSkills.length === 0) {
      return res.status(400).json({ error: 'At least one required skill must be specified.' });
    }

    const candidates = await Candidate.find();

    const matchedCandidates = candidates.map(candidate => {
      // Find skills that match the required list
      // Perform case-insensitive match for robustness
      const matchedSkills = candidate.skills.filter(skill =>
        requiredSkills.some(reqSkill => reqSkill.toLowerCase() === skill.toLowerCase())
      );

      // Find skills that match the preferred list
      const matchedPreferred = candidate.skills.filter(skill =>
        preferredSkills.some(prefSkill => prefSkill.toLowerCase() === skill.toLowerCase())
      );

      const score = (matchedSkills.length / requiredSkills.length) * 100;

      // Add a slight bonus for preferred skills (optional but great UX/AI-like feel)
      // We will keep standard score for classification but show preferred matched
      let matchCategory = 'Low Match';
      if (score >= 80) {
        matchCategory = 'High Match';
      } else if (score >= 50) {
        matchCategory = 'Medium Match';
      }

      const missingSkills = requiredSkills.filter(
        skill => !candidate.skills.some(candSkill => candSkill.toLowerCase() === skill.toLowerCase())
      );

      const meetsExperience = candidate.experience >= minExperience;

      return {
        candidate,
        matchedSkills,
        matchedPreferred,
        missingSkills,
        matchScore: Math.round(score),
        matchCategory,
        meetsExperience
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json(matchedCandidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
