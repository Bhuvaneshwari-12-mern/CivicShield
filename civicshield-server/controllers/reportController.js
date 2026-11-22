import { Report } from '../models/Report.js';

// @desc    Get all reports
// @route   GET /api/reports
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Create a new report
// @route   POST /api/reports
export const createReport = async (req, res) => {
  try {
    const { title, category, severity, lat, lng } = req.body;
    
    // The image path is provided by Multer
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // --- DUPLICATE DETECTION ENGINE ---
    // Check for similar reports within 500 meters
    const nearbyReports = await Report.find({
      category: category,
      location: {
        $near: {
          $geometry: { 
            type: 'Point', 
            coordinates: [parseFloat(lng), parseFloat(lat)] 
          },
          $maxDistance: 500 // 500 meters
        }
      }
    });

    const isDuplicate = nearbyReports.length > 0;

    const report = await Report.create({
      title,
      category,
      severity,
      imageUrl,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)] 
      }
    });

    res.status(201).json({ report, isDuplicate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get dashboard analytics
// @route   GET /api/reports/stats
export const getStats = async (req, res) => {
  try {
    const totalReports = await Report.countDocuments();
    const pending = await Report.countDocuments({ status: 'Pending' });
    const resolved = await Report.countDocuments({ status: 'Resolved' });
    const critical = await Report.countDocuments({ severity: 'Critical' });

    const categoryStats = await Report.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    const severityStats = await Report.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);

    res.json({
      totalReports, pending, resolved, critical,
      categoryStats, severityStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update report status
// @route   PATCH /api/reports/:id
export const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};