-- Migration script to add missing fields for enhanced features
USE messmate;

-- Update delivery_tracking table to add delivery_person_id and meal_type
ALTER TABLE delivery_tracking 
ADD COLUMN delivery_person_id INT,
ADD COLUMN meal_type ENUM('breakfast', 'lunch', 'dinner'),
ADD COLUMN delivery_date DATE,
ADD FOREIGN KEY (delivery_person_id) REFERENCES users(id) ON DELETE SET NULL;

-- Update chat_messages table to support private/group chat
ALTER TABLE chat_messages
ADD COLUMN receiver_id INT,
ADD COLUMN chat_type ENUM('general', 'private') DEFAULT 'general',
ADD FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE;

-- Update transactions table to add payment gateway fields
ALTER TABLE transactions
ADD COLUMN payment_id VARCHAR(255),
ADD COLUMN payment_method VARCHAR(50) DEFAULT 'razorpay',
ADD COLUMN razorpay_order_id VARCHAR(255),
ADD COLUMN razorpay_payment_id VARCHAR(255),
ADD COLUMN razorpay_signature VARCHAR(255);

-- Add index for better query performance
CREATE INDEX idx_skip_meals_date ON skip_meals(date, meal_type);
CREATE INDEX idx_delivery_date ON delivery_tracking(delivery_date, status);
CREATE INDEX idx_chat_type ON chat_messages(chat_type, sender_id, receiver_id);
