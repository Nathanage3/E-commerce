/* eslint-disable react/prop-types */

const SliderArrow = (props) => {
  const { className,  onClick, icon } = props;

  return (
    <div
      className={className}
      onClick={onClick}
    >
      <img src={icon} alt="" />
    </div>
  );
};

export default SliderArrow;
