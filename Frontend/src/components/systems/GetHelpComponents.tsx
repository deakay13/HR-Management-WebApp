import React, { useState } from 'react';

const GetHelpComponents = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    errorType: '',
    priority: 'Trung bình',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here (e.g., send to backend or show alert)
    alert('Cảm ơn bạn đã báo cáo lỗi. Chúng tôi sẽ xử lý sớm nhất có thể!');
    setFormData({ name: '', email: '', errorType: '', priority: 'Trung bình', description: '' });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Hướng Dẫn Sử Dụng Hệ Thống Quản Lý Nhân Sự Nội Bộ</h1>

      {/* Quản lý Thông Tin Nhân Viên */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">1. Quản Lý Thông Tin Nhân Viên</h2>
        <p className="mb-4 text-gray-700">
          Phần này cho phép quản lý toàn bộ thông tin nhân viên, bao gồm hồ sơ cá nhân, phòng ban, hợp đồng lao động và avatar.
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-600">
          <li><strong>Xem danh sách nhân viên:</strong> Truy cập menu "Thông tin nhân viên" để xem danh sách tất cả nhân viên với thông tin cơ bản như tên, phòng ban, vị trí.</li>
          <li><strong>Thêm nhân viên mới:</strong> Nhấn nút "Thêm nhân viên", điền đầy đủ thông tin cá nhân, chọn phòng ban và upload avatar nếu có.</li>
          <li><strong>Cập nhật thông tin:</strong> Chọn nhân viên từ danh sách, nhấn "Chỉnh sửa" để thay đổi thông tin cá nhân, phòng ban hoặc hợp đồng.</li>
          <li><strong>Quản lý hợp đồng:</strong> Upload và xem file hợp đồng lao động cho từng nhân viên trong thư mục uploads/hopdong.</li>
          <li><strong>Xóa nhân viên:</strong> Chỉ quản trị viên có quyền xóa nhân viên sau khi xác nhận (dữ liệu sẽ được lưu trữ trong lịch sử).</li>
          <li><strong>Tìm kiếm và lọc:</strong> Sử dụng thanh tìm kiếm để lọc theo tên, phòng ban hoặc mã nhân viên.</li>
        </ul>
      </section>

      {/* Quản Lý Lương */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-green-600">2. Quản Lý Lương</h2>
        <p className="mb-4 text-gray-700">
          Hệ thống quản lý lương toàn diện bao gồm lương cơ bản, phụ cấp, khấu trừ, giờ làm việc và bảng lương cuối tháng.
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-600">
          <li><strong>Lương cơ bản:</strong> Thiết lập và cập nhật lương cơ bản cho từng nhân viên dựa trên vị trí và kinh nghiệm.</li>
          <li><strong>Phụ cấp:</strong> Quản lý các khoản phụ cấp như phụ cấp chức vụ, phụ cấp khu vực, thưởng, v.v.</li>
          <li><strong>Khấu trừ:</strong> Ghi nhận các khoản khấu trừ như bảo hiểm, thuế thu nhập cá nhân, vi phạm nội quy.</li>
          <li><strong>Giờ làm việc:</strong> Theo dõi và ghi nhận số giờ làm việc thực tế của nhân viên hàng ngày/tháng.</li>
          <li><strong>Tính lương tự động:</strong> Hệ thống tự động tính lương cuối tháng dựa trên công thức: Lương cơ bản + Phụ cấp - Khấu trừ + (Giờ làm x Lương giờ).</li>
          <li><strong>Bảng lương:</strong> Xuất và xem bảng lương chi tiết cho từng nhân viên hoặc toàn bộ phòng ban.</li>
          <li><strong>Báo cáo lương:</strong> Tạo báo cáo tổng hợp lương theo tháng, quý hoặc năm.</li>
        </ul>
      </section>

      {/* Quản Lý Quyền và Vai Trò */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-purple-600">3. Quản Lý Quyền và Vai Trò</h2>
        <p className="mb-4 text-gray-700">
          Phân quyền chi tiết cho người dùng dựa trên vai trò để đảm bảo bảo mật và quản lý truy cập.
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-600">
          <li><strong>Vai trò (Roles):</strong> Tạo và quản lý các vai trò như Quản trị viên, Quản lý, Nhân viên, v.v.</li>
          <li><strong>Quyền (Permissions):</strong> Gán các quyền cụ thể cho từng vai trò như xem thông tin, chỉnh sửa lương, xóa dữ liệu.</li>
          <li><strong>Tài khoản người dùng:</strong> Tạo tài khoản cho nhân viên với username/password và gán vai trò tương ứng.</li>
          <li><strong>Xác thực JWT:</strong> Hệ thống sử dụng JWT token để xác thực phiên làm việc, tự động logout sau thời gian không hoạt động.</li>
          <li><strong>Session management:</strong> Theo dõi và quản lý các phiên đăng nhập để đảm bảo an toàn.</li>
          <li><strong>Đăng nhập/Đăng xuất:</strong> Sử dụng email/username và password để đăng nhập, hệ thống ghi nhớ phiên làm việc.</li>
        </ul>
      </section>

      {/* Các Chức Năng Khác */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-orange-600">4. Các Chức Năng Khác</h2>
        <ul className="list-disc list-inside mb-4 text-gray-600">
          <li><strong>Upload file:</strong> Tải lên avatar nhân viên (thư mục uploads/avatars) và file hợp đồng (uploads/hopdong) với giới hạn kích thước và định dạng.</li>
          <li><strong>Tìm kiếm nâng cao:</strong> Tìm kiếm nhân viên theo nhiều tiêu chí như tên, phòng ban, vị trí, ngày vào làm.</li>
          <li><strong>Phân trang:</strong> Hiển thị danh sách với phân trang để dễ dàng duyệt qua dữ liệu lớn.</li>
          <li><strong>Định dạng ngày tháng:</strong> Hệ thống sử dụng định dạng ngày tháng thống nhất (DD/MM/YYYY) cho tất cả dữ liệu.</li>
          <li><strong>Báo cáo và xuất dữ liệu:</strong> Xuất báo cáo Excel/PDF về nhân viên, lương, thống kê phòng ban.</li>
          <li><strong>Dashboard:</strong> Trang tổng quan hiển thị số liệu thống kê như tổng nhân viên, lương trung bình, v.v.</li>
          <li><strong>Đa ngôn ngữ:</strong> Hỗ trợ tiếng Việt làm ngôn ngữ chính cho giao diện.</li>
        </ul>
      </section>

      {/* Form Báo Cáo Lỗi */}
      <section className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-red-600">Báo Cáo Lỗi</h2>
        <p className="mb-4 text-gray-700">
          Nếu bạn phát hiện lỗi trong hệ thống, hãy báo cáo ngay để đội kỹ thuật xử lý kịp thời. Bao gồm mô tả chi tiết và ảnh chụp màn hình nếu có.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Họ và Tên</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="errorType" className="block text-sm font-medium text-gray-700">Loại Lỗi / Module Bị Lỗi</label>
            <select
              id="errorType"
              name="errorType"
              value={formData.errorType}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Chọn loại lỗi</option>
              <option value="Quản lý nhân viên">Quản lý nhân viên</option>
              <option value="Quản lý lương">Quản lý lương</option>
              <option value="Quản lý quyền">Quản lý quyền</option>
              <option value="Đăng nhập/Xác thực">Đăng nhập/Xác thực</option>
              <option value="Upload file">Upload file</option>
              <option value="Tìm kiếm/Phân trang">Tìm kiếm/Phân trang</option>
              <option value="Báo cáo/Xuất dữ liệu">Báo cáo/Xuất dữ liệu</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Mức Độ Ưu Tiên</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Thấp">Thấp</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Cao">Cao</option>
              <option value="Khẩn cấp">Khẩn cấp</option>
            </select>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Mô Tả Lỗi Chi Tiết</label>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Mô tả chi tiết lỗi bạn gặp phải, bao gồm các bước để tái tạo lỗi..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Gửi Báo Cáo Lỗi
          </button>
        </form>
      </section>
    </div>
  );
};

export default GetHelpComponents;