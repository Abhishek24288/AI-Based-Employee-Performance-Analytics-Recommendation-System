const Candidate = require('../models/Candidate');

exports.addCandidate = async (req, res) => {
  try {
    const candidate = new Candidate(req.body);
    const savedCandidate = await candidate.save();
    res.status(201).json(savedCandidate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
    res.status(200).json(candidate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
    res.status(200).json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
