const dayjs = require('dayjs');

const DEFAULT_MEAL_SCHEDULE = {
  breakfast: '08:00',
  lunch: '13:00',
  dinner: '20:00',
};

const canSkipMeal = ({ date, mealType }) => {
  const mealTime = process.env[`MEAL_${mealType.toUpperCase()}_TIME`] || DEFAULT_MEAL_SCHEDULE[mealType];
  if (!mealTime) {
    return { allowed: false, reason: 'Unsupported meal type' };
  }

  const cutoff = dayjs(`${date} ${mealTime}`).subtract(3, 'hour');
  if (dayjs().isAfter(cutoff)) {
    return {
      allowed: false,
      reason: `Skip deadline passed. You must skip before ${cutoff.format('YYYY-MM-DD HH:mm')}`,
    };
  }

  return { allowed: true };
};

module.exports = { canSkipMeal };
