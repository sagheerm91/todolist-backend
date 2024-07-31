import { log } from "console";
import Course from "../models/CourseModel.js";
import Order from "../models/OrderModel.js";
import fs from "fs";
import Stripe from "stripe";
import Payment from "../models/PaymentModel.js";
import { OrderStatus } from "../enums/OrderStatus.js";

const stripeKey = process.env.STRIPE_SK;
const stripe = Stripe(`${stripeKey}`);
const webhookKey = process.env.STRIPE_WEBHOOK_SK;



class CourseService {
  async getAllCourses({ page, limit, search }) {
    try {
      const query = {};

      if (search) {
        query.$or = [{ title: { $regex: search, $options: "i" } }];
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

  async purchase({ createdBy, courseId }) {
    try {
      // console.log('====================================');
      // console.log("ID & C ID --- ", {createdBy, courseId});
      // console.log('====================================');
      const newOrder = await Order.create({
        createdBy,
        courseId,
      });

      await newOrder.save();
      // console.log('====================================');
      // console.log("Data --- ", newOrder);
      // console.log('====================================');
      return { data: newOrder };
    } catch (error) {
      return { error };
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

  async getOrderByUser({ id }) {
    try {
      const orders = await Order.find({ createdBy: id });
      if (!orders) {
        return { data: null, message: "No orders found" };
      }
      return { orders };
    } catch (error) {
      return { error };
    }
  }

  async addCourse({
    title,
    description,
    originalPrice,
    discountedPrice,
    image,
    createdBy,
  }) {
    const courseExist = await Course.findOne({ title });
    console.log("====================================");
    console.log("Data --- ", {
      title,
      description,
      originalPrice,
      discountedPrice,
      createdBy,
    });
    console.log("====================================");
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

  // async setCourses({totalPrice, sessionId, user, ids}){
  //   const userId = user; // Extract as needed
  //   const courseIds = ids;
  //   const price = totalPrice;
  //   const paymentId = sessionId;

  // const payment = new Payment({
  //   userId,
  //   courseIds,
  //   price,
  //   paymentId,
  // });
  // await payment.save();
  // }

  async makePayment({ user, title, _id, discountedPrice }) {
    try {
      const createdBy = user;
      const courseId = _id;
      const courseTitle = title;
      const price = discountedPrice;
      const orderStatus = OrderStatus.PENDING;

      const order = new Order({
        createdBy,
        courseId,
        courseTitle,
        price,
        orderStatus,
      });
      await order.save();

      const orderId = order._id;
      
      // console.log('====================================');
      // console.log("O ID --- ", orderId);
      // console.log('====================================');

      // Create the Stripe session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: title,
              },
              unit_amount: discountedPrice * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        metadata: {
          orderId: orderId.toString(),
        },
        success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
        cancel_url: `http://localhost:3000/declined?order_id=${order._id}`,
      });

      // console.log('====================================');
      // console.log("Sesssion --- ", session);
      // console.log('====================================');
      return { id: session.id };
    } catch (error) {
      throw new Error("Error creating payment session");
    }
  }

  async savePayment({ sessionId, orderId  }) {
    try {
      // Retrieve session details
      // const session = await stripe.checkout.sessions.retrieve(sessionId);
      // const paymentIntent = await stripe.paymentIntents.retrieve(
      //   session.payment_intent
      // );

      //const _id = orderId;
      // Update the order status to 'completed'
      const order = await Order.findByIdAndUpdate(
        { _id: orderId },
        { orderStatus: OrderStatus.COMPLETED },
        { new: true } // This option returns the updated document
      );

      if (!order) {
        return { success: false, message: "Order not found" };
      }

      return { success: true, message: "Payment details saved", order };
    } catch (error) {
      console.error("Error saving payment details:", error);
      return { success: false, message: "Error saving payment details" };
    }
  }

  async getCoursesByUser({ id, page, limit, search }) {
    try {
      const query = {
        createdBy: id,
      };

      if (search) {
        query.$or = [{ title: { $regex: search, $options: "i" } }];
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

  async handleCancelPayment({ orderId }) {
    try {
      // const session = await stripe.checkout.sessions.retrieve(sessionId);
      // const paymentIntent = await stripe.paymentIntents.retrieve(
      //   session.payment_intent
      // );
      const order = await Order.findByIdAndUpdate(
        { _id: orderId },
        { orderStatus: OrderStatus.FAILED },
        { new: true }
      );

      if (!order) {
        return { success: false, message: "Order not found" };
      }

      return { success: true, message: "Payment details saved", order };
    } catch (error) {
      console.error("Error saving payment details:", error);
      return { success: false, message: "Error saving payment details" };
    }
  }

  async stripeWebhook({ body, sig }) {
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, `${webhookKey}`);
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return { error: "Webhook signature verification failed" };
    }
    const session = event.data.object;
    // console.log('====================================');
    // console.log("Session Object --- ", session);
    // console.log('====================================');
    // Handle the event
    const orderId = session.metadata;
    // console.log("orderId----",orderId);
    // console.log('====================================');
    // console.log("Event Type --- ", event.type);
    // console.log('====================================');
    // console.log("event.type---------",session);
  switch (event.type) {
    case "checkout.session.completed":
      await this.savePayment({
        sessionId: session.id,
        orderId: orderId,
      });
      break;

    case "payment_intent.payment_failed":
      await this.handleCancelPayment({
        orderId: orderId,
      });
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

    // Return a response to acknowledge receipt of the event
    return { received: true };
  }
}

export default new CourseService();
