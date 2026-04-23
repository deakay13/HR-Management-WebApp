export const currentAccount = async (req, res) => {
  try {
    const account = req.account;
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.status(200).json(account);
  } catch (error) {
    console.error("Lỗi khi gọi", error);
    res.status(500).json({ message: "Server error" });
  }
};
