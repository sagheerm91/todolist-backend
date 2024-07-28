import upload from "../config/multerConfig.js";
import CourseService from "../services/CourseService.js";

export const getCourses = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;
  const search = req.query.search || '';
  const result = await CourseService.getAllCourses({ page, limit, search });
  if (result.error) {
    return res.status(500).json(result);
  } else if (result.data === null) {
    return res.status(404).json(result);
  } else {
    return res.status(200).json({ data: result });
  }
};

export const getCoursesByUser = async (req, res) => {

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;
  const search = req.query.search || '';

  const id = req.params.id;
  // console.log("====================================");
  // console.log("ADMIN USER ID --- ", id);
  // console.log("====================================");
  const result = await CourseService.getCoursesByUser({ id, page, limit,search });
  if (result.error) {
    return res.status(500).json(result);
  } else {
    return res.status(200).json({ data: result });
  }
};

export const getSingleCourse = async (req, res) => {
  const result = await CourseService.getSingleCourse(req.params.id);
  if (result.error) {
    return res.status(500).json(result);
  } else if (result.data === null) {
    return res.status(404).json(result);
  } else {
    return res.status(200).json({ data: result });
  }
};

export const addCourse = async (req, res) => {
  const createdBy = req.header("UserId");

  // console.log("====================================");
  // console.log("ADMIN USER ID IN SUBMISSION --- ", userId);
  // console.log("====================================");
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const image = req.file ? `/uploads/${req.file.filename}` : undefined;
      const result = await CourseService.addCourse({
        createdBy,
        ...req.body,
        image,
      });

      if (result.error) {
        return res.status(409).json({ message: result.error }); // 409 Conflict
      }

      return res.status(200).json(result); // 200 OK
    } catch (error) {
      return res.status(500).json({ message: "Error creating course" });
    }
  });
};

export const updateCourse = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    const createdBy = req.header("UserId");

    try {
      const image = req.file ? `/uploads/${req.file.filename}` : undefined;
      const id = req.params.id;
      const result = await CourseService.updateCourse({
        id,
        createdBy,
        ...req.body,
        image,
      });

      if (result.error) {
        return res.status(409).json({ message: result.error });
      }

      return res.status(200).json({ data: result });
    } catch (error) {
      return res.status(500).json({ message: "Error updating course" });
    }
  });
};

export const purchase = async (req, res) => {
  const createdBy = req.query.userId;
  const courseId = req.query.courseId;

  // console.log("====================================");
  //  console.log("Course --- ", courseId);
  // console.log("Id --- ", userId);
  // console.log("====================================");

  const result = await CourseService.purchase({createdBy, courseId});
  if (result) {
    return res.status(200).json({ data: result });
  } else {
    return res.status(404).json({ message: "Error purchasing the course" });
  }
};

export const deleteCourse = async (req, res) => {
  const result = await CourseService.deleteCourse({
    id: req.params.id,
  });
  if (result) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json(result);
  }
};

export const getOrderByUser = async (req, res) => {
  const id = req.params.id;
  // console.log("====================================");
  // console.log("USER ID --- ", id);
  // console.log("====================================");
  const result = await CourseService.getOrderByUser({ id});
  if (result.error) {
    return res.status(500).json(result);
  } else {
    return res.status(200).json({ data: result });
  }
};
