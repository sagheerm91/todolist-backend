import { log } from "console";
import Course from "../models/CourseModel.js";
import Order from "../models/OrderModel.js";
import fs from "fs";
import path from "path";
import { create } from "domain";
import Stripe from "stripe";
import Payment from "../models/PaymentModel.js";

const stripeKey = process.env.STRIPE_SK;
const stripe = Stripe(`${stripeKey}`); 


class CourseService {
  
  async getAllCourses({ page, limit, search }) {
    try {
      const query = {};

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
        ];
      }

      const options = {
        page: page || 1,
        limit: limit || 3,
      };
      const courses = await Course.paginate(query, options);

      const updatedCourses = courses.docs.map((course) => ({
        ...course._doc,
        image: `http://localhost:8000${course.image}`,
      }));
      // console.log('====================================');
      // console.log("Courses --- ", courses);
      // console.log('====================================');
      return {
        data: updatedCourses,
        total: courses.totalDocs,
        totalPages: courses.totalPages,
        currentPage: courses.page,
      };
    } catch (error) {
      return { error };
    }
  }

  async purchase({createdBy, courseId}) {
    try {
      // console.log('====================================');
      // console.log("ID & C ID --- ", {createdBy, courseId});
      // console.log('====================================');
      const newOrder = await Order.create({
        createdBy,
        courseId
      });

      await newOrder.save();
      // console.log('====================================');
      // console.log("Data --- ", newOrder);
      // console.log('====================================');
      return {data: newOrder};
    } catch (error) {
      return {error};
    }
  }

  async getSingleCourse(id) {
    try {
      const course = await Course.findOne({ _id: id });
      if (!course) {
        return { data: null, message: "No courses found" };
      }

      course.image = `http://localhost:8000${course.image}`;

      return { data: course };
    } catch (error) {
      return { error };
    }
  }

  async getOrderByUser({id}){
    try {
      const orders = await Order.find({createdBy:id});
      if (!orders) {
        return { data: null, message: "No orders found" };
      }
      return {orders};
    } catch (error) {
      return {error};
    }
  }

  async addCourse({
    title,
    description,
    originalPrice,
    discountedPrice,
    image,
    createdBy
  }) {
    const courseExist = await Course.findOne({ title });
    console.log('====================================');
    console.log("Data --- ", {title,description,originalPrice,discountedPrice, createdBy});
    console.log('====================================');
    if (courseExist) {
      return { error: "Course with the same name already exists" };
    }

    // console.log("====================================");
    // console.log("USER ID WHILE ADDING --- ", createdBy);
    // console.log("====================================");

    const createdCourse = await Course.create({
      title,
      description,
      originalPrice,
      discountedPrice,
      image,
      createdBy,
    });
    return {
      message: "Course created successfully",
      //token: await createdCourse.generateToken(),
      course: createdCourse,
    };
  }

  async updateCourse({
    id,
    createdBy,
    title,
    description,
    originalPrice,
    discountedPrice,
    image,
  }) {
    try {
      const courseExist = await Course.findById({ _id: id });

      if (!courseExist) {
        return { error: "Course not found" };
      }
      if (courseExist.image) {
        const imgPath = courseExist.image.replace("/uploads", "uploads").trim();
        fs.unlinkSync(imgPath);
      }
      courseExist.title = title || courseExist.title;
      courseExist.description = description || courseExist.description;
      courseExist.originalPrice = originalPrice || courseExist.originalPrice;
      courseExist.discountedPrice =
        discountedPrice || courseExist.discountedPrice;
      courseExist.image = image || courseExist.image;
      courseExist.createdBy = createdBy || courseExist.createdBy;

      await courseExist.save();

      return {
        message: "Course updated successfully",
        course: {
          _id: courseExist._id,
          title: courseExist.title,
          description: courseExist.description,
          originalPrice: courseExist.originalPrice,
          discountedPrice: courseExist.discountedPrice,
          image: `http://localhost:8000${courseExist.image}`,
        },
      };
    } catch (error) {
      return { error: "Server error" };
    }
  }

  async deleteCourse({ id }) {
    try {
      const course = await Course.findByIdAndDelete({ _id: id });

      if (!course) {
        return { message: "Course not found" };
      }
      const imgPath = course.image.replace("/uploads", "uploads").trim();

      // console.log("Image Path --- ", imgPath);
      // Delete the image file if it exists

      fs.unlinkSync(imgPath);

      return {
        message: "Course and associated image deleted successfully",
        course: course,
      };
    } catch (error) {
      return error;
    }
  }

  async makePayment({totalPrice, name, user, ids}){
    try {
     
      console.log('====================================');
     console.log("IDs --- ", ids);
     console.log('====================================');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: name, 
            },
            unit_amount: totalPrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/cancel`,
    });

    const userId = user; // Extract as needed
      const courseIds = ids;
      const price = totalPrice; 
      const paymentId = session.id;

    const payment = new Payment({
      userId,
      courseIds,
      price,
      paymentId,
    });

    await payment.save();
  // console.log('====================================');
  // console.log("Session Id --- ", session.id);
  // console.log('====================================');

    return ({ id: session.id });
    } catch (error) {
      throw new Error("Error fetching courses");
    }
  }

  async savePayment({sessionId,}){
    try {
      
      // Retrieve session details
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
  
      
      return ({ success: true, message: 'Payment details saved' });
    } catch (error) {
      console.error('Error saving payment details:', error);
      return ({ success: false, message: 'Error saving payment details' });
    }
  }

  async getCoursesByUser({ id, page, limit, search }) {
    try {

      const query = {
        createdBy: id 
      };

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
        ];
      }

      const options = {
        page: page || 1,
        limit: limit || 3,
      };

      const courses = await Course.paginate(query, options);

      const updatedCourses = courses.docs.map((course) => ({
        ...course._doc,
        image: `http://localhost:8000${course.image}`,
      }));

      return {
        data: updatedCourses,
        total: courses.totalDocs,
        totalPages: courses.totalPages,
        currentPage: courses.page,
      };
    } catch (error) {
      throw new Error("Error fetching courses");
    }
  }
}

export default new CourseService();
