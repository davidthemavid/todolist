//calculates current date, day, & time

exports.getDate = () => {
  const today = new Date();

  const dateOptions = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  return today.toLocaleDateString("en-US", dateOptions);
};

