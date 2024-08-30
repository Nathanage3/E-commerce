import { useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const CartItems = () => {
  const { cartItems, removeFromCart } = useContext(AppContext);
  const handleRemoveFromCart = (id) => {
    removeFromCart(id);
  };
  return (
    <ul className="cart_items_list">
    {cartItems.map((item) => (
      <li key={item.id} className="cart_item">
        <div className="item_image">
          <img src={item.img} alt={item.title} />
        </div>
        <div className="item_details">
          <span className="item_title">{item.title}</span>
          <div className="item_price_details">
            <span className="item_price">${item.price}</span>
            <span className="item_old_price">${item.oldPrice}</span>
          </div>
        </div>
        <button
          onClick={() => handleRemoveFromCart(item.id)}
          className="remove_from_cart_btn"
        >
        <FontAwesomeIcon className="icon_trash" icon={faTrashCan} />
        </button>
      </li>
    ))}
  </ul>
  )
}

export default CartItems