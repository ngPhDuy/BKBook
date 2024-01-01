import styles from '../Styles/Xemchitiet.module.css';
import React, { useState, useEffect } from 'react';
import Header from '../Component/logHeader.js';
import Footer from '../Component/Footer.js';
import Sidebar from '../Component/sideBar.js';
import Table from 'react-bootstrap/Table';
import { useParams, useNavigate } from 'react-router-dom';

const ViewDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const { orderId } = useParams();
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3001/api/orderProduct/${orderId}`)
      .then(res => res.json())
      .then(
        (result) => {
          setBooks(result);
        },
        (error) => {
          console.log(error);
        }
      )
  }, [orderId]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const openSecondModal = () => {
    setIsSecondModalOpen(true);
    setIsModalOpen(false); // Đóng cửa sổ modal hiện tại
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsSecondModalOpen(false);
    turnBack();
  };

  const turnBack = () => {
    navigate('/personalBuy');
  }

  const handelCancel = () => {
    try {
      fetch(`http://localhost:3001/api/updateOrderState/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state: 'Yêu cầu hủy đơn' }),
      })
        .then(res => res.json())
        .then(
          (result) => {
            console.log(result);
          },
          (error) => {
            console.log(error);
          }
        )
      openSecondModal();
    }
    catch (error) {
      console.log(error);
      window.alert('Hiện tại không thể hủy đơn. Vui lòng thử lại!');
    }
  }
  
  const handelPayment = () => {
    const payment = window.confirm('Bạn có muốn thanh toán đơn hàng này?');
    if (!payment) return;
    try {
      fetch(`http://localhost:3001/api/updateOrderState/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state: 'Đã thanh toán' }),
      })
        .then(res => res.json())
        .then(
          (result) => {
            console.log(result);
          },
          (error) => {
            console.log(error);
          }
        )
      window.alert('Thanh toán thành công!');
      turnBack();
    } catch (error) {
      console.log(error);
      window.alert('Thanh toán thất bại!');
    }
  }

  if (books.length === 0) return <div>Đang tải...</div>;
  console.log(books);
  return (
    <div className={styles.containerDetails}>
      <h2>Lịch sử mua hàng</h2>
      <button className={styles.buttonDetails_1} onClick={turnBack}>Quay lại</button>
      <div className={styles.midDetails}>
        <div className={styles.midDetailsLeft}>
          <img src={`/images/${books[0].Anh}`} />
        </div>
        <div className={styles.midDetailsRight}>
          <button className={styles.buttonDetails_2} >
            {books[0].XacNhan}
          </button>
          <Table className={styles.orderTable}>
        <thead>
          <tr>
            <th>Tên sách</th>
            <th>Số lượng</th>
            <th>Giá</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.title}>
              <td className='book-name'>{book.Ten}</td>
              <td>{book.SoLuong}</td>
              <td>{book.TongTien.toLocaleString('vi-VN')}<sup>đ</sup></td>
            </tr>
          ))}
        </tbody>
      </Table>
          <div className={styles.midDetailsRightBottom}>
          {books[0].XacNhan !== 'Đã thanh toán' && books[0].XacNhan !== 'Đã hủy' &&
            books[0].XacNhan !== 'Đã giao' && books[0].XacNhan !== 'Đang giao' &&
          (
            <button
            className={styles.buttonDetails_3}
            onClick={handelPayment}
            >
            Thanh Toán
            </button>
          )}
            <button className={styles.buttonDetails_4} onClick={openModal}>
              Hủy đơn
            </button>
            {isModalOpen && (
              <div className={styles.modalWindow}>
                <div className={styles.modalContent}>
                  <h3>Bạn có muốn hủy đơn?</h3>
                  <div className={styles.modalButton}>
                    <button className={styles.modalButton_1} onClick={handelCancel}>Có</button>
                    <button className={styles.modalButton_2} onClick={closeModal}>Không</button>
                  </div>
                </div>
              </div>
            )}
            {isSecondModalOpen && (
              <div className={styles.modalWindow}>
                <div className={styles.modalContent_2}>
                  <h4>Đã gửi yêu cầu hủy thành công</h4>
                  <button className={styles.modalButton_3} onClick={closeModal}>
                    Quay lại trang chủ
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
function App() {
  return (
    <React.Fragment>
      <Header />
      <Sidebar />
      <ViewDetails />
      <Footer />
    </React.Fragment>
  );
}
export default App;