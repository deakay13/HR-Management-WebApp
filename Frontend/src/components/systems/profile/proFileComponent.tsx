import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { EmployeeServices } from "@/services/informationServices/employeeServices";
import type { Employee } from "@/types/informationTypes/employeeTypes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { EmployeeSchema } from "@/types/informationTypes/employeeTypes";
import {
    IconUser,
    IconMail,
    IconPhone,
    IconMapPin,
    IconCalendar,
    IconBriefcase,
    IconId,
    IconGenderMale,
    IconGenderFemale,
    IconUserCircle,
    IconEdit
} from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { useEmployeeStore } from "@/stores/informationStores/employeeStore";
import { IconCamera, IconLoader2 } from "@tabler/icons-react";
import { useRef } from "react";
import { toast } from "sonner";
import { getImageUrl } from "@/utils/imageUtils";

const ProfileComponent = () => {
    const { account, avatarUrl, setAvatarUrl } = useAuthStore();
    const { role } = useAuthorizeStore();
    const { t } = useTranslation();
    const { updateEmployee } = useEmployeeStore();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editType, setEditType] = useState<"personal" | "contact" | null>(null);
    const [editFormData, setEditFormData] = useState<Employee | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchEmployee = async () => {
            if (account?.MaNV) {
                try {
                    const data = await EmployeeServices.getEmployee(account.MaNV);
                    setEmployee(data);
                    // Initialize global avatar URL
                    if (data?.HinhAnh) {
                        setAvatarUrl(getImageUrl(data.HinhAnh));
                    }
                } catch (error) {
                    console.error("Failed to fetch employee details:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchEmployee();
    }, [account]);

    const handleAvatarClick = () => {
        setPreviewOpen(true);
    };

    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !account?.MaNV) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error(t("Vui lòng chọn một file ảnh hợp lệ."));
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error(t("Ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB."));
            return;
        }

        // Create preview URL
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setSelectedFile(file);
        setPreviewOpen(true);
    };

    const handleSaveAvatar = async () => {
        if (!selectedFile || !account?.MaNV) return;

        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append("HinhAnh", selectedFile);
            
            await updateEmployee(account.MaNV, formData);
            
            // Refresh employee data
            const updatedData = await EmployeeServices.getEmployee(account.MaNV);
            setEmployee(updatedData);

            // Sync avatar to global store so NavUserMini updates instantly
            if (updatedData?.HinhAnh) {
                setAvatarUrl(getImageUrl(updatedData.HinhAnh));
            }

            toast.success(t("Cập nhật ảnh đại diện thành công!"));
            handleClosePreview();
        } catch (error: any) {
            console.error("Failed to upload avatar:", error);
            const message = error.response?.data?.message || error.message || t("Không thể tải ảnh lên. Vui lòng thử lại.");
            toast.error(message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleClosePreview = () => {
        setPreviewOpen(false);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleOpenEdit = (type: "personal" | "contact") => {
        if (employee) {
            setEditFormData({
                ...employee,
                NgaySinh: employee.NgaySinh ? employee.NgaySinh.split("T")[0] : "",
                NgayVaoLam: employee.NgayVaoLam ? employee.NgayVaoLam.split("T")[0] : "",
                // Clean SDT: remove non-numeric characters to pass validation
                SDT: employee.SDT ? employee.SDT.replace(/\D/g, "") : "",
            });
            setEditType(type);
            setErrors({});
            setIsEditOpen(true);
        }
    };

    const handleUpdateInfo = async () => {
        if (!editFormData || !account?.MaNV || !editType) return;

        try {
            // Define fields and schema based on editType
            let validatedData;
            if (editType === "personal") {
                const personalSchema = EmployeeSchema.pick({
                    HoVaTen: true,
                    GioiTinh: true,
                    NgaySinh: true,
                    MaNV: true, // Keep these as they are needed for the record
                    MaPB: true,
                    SDT: true,
                    DiaChi: true,
                    NgayVaoLam: true
                });
                validatedData = personalSchema.parse(editFormData);
            } else {
                const contactSchema = EmployeeSchema.pick({
                    SDT: true,
                    DiaChi: true,
                    HoVaTen: true, // Keep others as they are needed
                    GioiTinh: true,
                    NgaySinh: true,
                    MaNV: true,
                    MaPB: true,
                    NgayVaoLam: true
                });
                validatedData = contactSchema.parse(editFormData);
            }

            setErrors({});
            setIsUploading(true);
            
            // Use FormData to be consistent with the backend route
            const formData = new FormData();
            Object.entries(validatedData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, value.toString());
                }
            });

            await EmployeeServices.updateEmployee(account.MaNV, formData);
            
            // Refresh data
            const updatedData = await EmployeeServices.getEmployee(account.MaNV);
            setEmployee(updatedData);
            await useAuthStore.getState().getCurrentAccount();
            
            toast.success(t("Cập nhật thông tin thành công!"));
            setIsEditOpen(false);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors = error.flatten().fieldErrors as Record<string, string[]>;
                const newErrors: Record<string, string> = {};
                let firstErrorMessage = "";
                
                for (const key in fieldErrors) {
                    if (fieldErrors[key]) {
                        newErrors[key] = fieldErrors[key][0];
                        if (!firstErrorMessage) firstErrorMessage = fieldErrors[key][0];
                    }
                }
                setErrors(newErrors);
                // Show the specific first error message in the toast
                toast.error(t(firstErrorMessage) || t("Vui lòng kiểm tra lại thông tin nhập vào."));
            } else {
                console.error("Failed to update employee info:", error);
                toast.error(t("Không thể lưu thay đổi. Vui lòng thử lại."));
            }
        } finally {
            setIsUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 space-y-6 animate-pulse">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="h-64 rounded-2xl" />
                    <Skeleton className="h-64 rounded-2xl" />
                </div>
            </div>
        );
    }

    const initials = account?.TenTaiKhoan?.charAt(0).toUpperCase() || "U";

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Profile Section */}
            <div className="relative overflow-hidden rounded-3xl bg-[#6A30F7] p-8 text-white shadow-glow">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-black/10 blur-3xl" />

                <div className="relative flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                        <div className="absolute -inset-1 rounded-full bg-white/20 blur group-hover:bg-white/40 transition-smooth" />
                        <Avatar className="h-32 w-32 border-4 border-white/20 shadow-2xl relative overflow-hidden">
                            <AvatarImage 
                                src={avatarUrl || getImageUrl(employee?.HinhAnh)} 
                                alt={account?.TenTaiKhoan} 
                                className="object-cover" 
                            />
                            <AvatarFallback className="text-4xl bg-white/10 text-white backdrop-blur-md font-bold">
                                {initials}
                            </AvatarFallback>
                            
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth backdrop-blur-[2px]">
                                <IconCamera className="text-white size-8" />
                            </div>

                            {/* Uploading Spinner */}
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-md z-10">
                                    <IconLoader2 className="text-white size-8 animate-spin" />
                                </div>
                            )}
                        </Avatar>
                        
                        {/* Hidden Input File */}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleAvatarChange} 
                            accept="image/*" 
                            className="hidden" 
                        />
                    </div>

                    <div className="text-center md:text-left space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight">{employee?.HoVaTen || account?.TenTaiKhoan}</h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 items-center">
                            <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/40 backdrop-blur-md px-4 py-1 text-sm font-medium">
                                {role?.TenVaiTro || t("Nhân viên")}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Personal Information */}
                <Card className="glass-strong border-none shadow-soft hover:shadow-glow transition-smooth overflow-hidden">
                    <div className="h-1 bg-[#6A30F7] w-full opacity-50" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="flex items-center gap-2 text-[hsl(var(--primary))]">
                            <IconUserCircle className="size-5" />
                            {t("Thông tin cá nhân")}
                        </CardTitle>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-[#6A30F7] hover:bg-[#6A30F7]/10"
                            onClick={() => handleOpenEdit("personal")}
                        >
                            <IconEdit className="size-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <IconUser className="size-4 group-hover:text-[hsl(var(--primary))] transition-colors" />
                                <span className="text-sm">{t("Họ và tên")}</span>
                            </div>
                            <span className="font-semibold text-foreground">{employee?.HoVaTen}</span>
                        </div>
                        <Separator className="opacity-30" />
                        <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-3 text-muted-foreground">
                                {employee?.GioiTinh === "Nam" ? <IconGenderMale className="size-4" /> : <IconGenderFemale className="size-4" />}
                                <span className="text-sm">{t("Giới tính")}</span>
                            </div>
                            <span className="font-semibold text-foreground">{t(employee?.GioiTinh || "")}</span>
                        </div>
                        <Separator className="opacity-30" />
                        <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <IconCalendar className="size-4" />
                                <span className="text-sm">{t("Ngày sinh")}</span>
                            </div>
                            <span className="font-semibold text-foreground">
                                {(() => {
                                    const dateVal = employee?.NgaySinh || (employee as any)?.ngaySinh;
                                    if (!dateVal) return "N/A";
                                    return dateVal.includes("T") ? new Date(dateVal).toLocaleDateString('vi-VN') : dateVal;
                                })()}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Information */}
                <Card className="glass-strong border-none shadow-soft hover:shadow-glow transition-smooth overflow-hidden">
                    <div className="h-1 bg-[#6A30F7] w-full opacity-50" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="flex items-center gap-2 text-[hsl(var(--primary))]">
                            <IconMail className="size-5" />
                            {t("Liên hệ & Địa chỉ")}
                        </CardTitle>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-[#6A30F7] hover:bg-[#6A30F7]/10"
                            onClick={() => handleOpenEdit("contact")}
                        >
                            <IconEdit className="size-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <IconPhone className="size-4" />
                                <span className="text-sm">{t("Số điện thoại")}</span>
                            </div>
                            <span className="font-semibold text-foreground">{employee?.SDT || (employee as any)?.sdt || t("Chưa cập nhật")}</span>
                        </div>
                        <Separator className="opacity-30" />
                        <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <IconMapPin className="size-4" />
                                <span className="text-sm">{t("Địa chỉ cư trú")}</span>
                            </div>
                            <span className="font-semibold text-sm text-foreground text-right max-w-[60%] truncate">
                                {employee?.DiaChi || (employee as any)?.diaChi || t("Chưa cập nhật")}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Job Details */}
                <Card className="glass-strong border-none shadow-soft hover:shadow-glow transition-smooth overflow-hidden lg:col-span-1 md:col-span-2 lg:col-auto">
                    <div className="h-1 bg-[#6A30F7] w-full opacity-50" />
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-[hsl(var(--primary))]">
                            <IconBriefcase className="size-5" />
                            <span>{t("Thông tin công việc")}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <IconId className="size-4" />
                                <span className="text-sm">{t("Mã nhân viên")}</span>
                            </div>
                            <span className="font-semibold text-foreground">
                                {employee?.MaNV || (employee as any)?.maNV}
                            </span>
                        </div>
                        <Separator className="opacity-30" />
                        <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <IconBriefcase className="size-4" />
                                <span className="text-sm">{t("Phòng ban")}</span>
                            </div>
                            <span className="font-semibold text-foreground">
                                {employee?.PhongBan?.TenPB || (employee as any)?.phongBan?.tenPB || "N/A"}
                            </span>
                        </div>
                        <Separator className="opacity-30" />
                        <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <IconCalendar className="size-4" />
                                <span className="text-sm">{t("Ngày vào làm")}</span>
                            </div>
                            <span className="font-semibold text-foreground">
                                {(() => {
                                    const dateVal = employee?.NgayVaoLam || (employee as any)?.ngayVaoLam;
                                    if (!dateVal) return "N/A";
                                    // Nếu là định dạng ISO (chứa chữ T), format lại. Nếu không, hiển thị trực tiếp.
                                    return dateVal.includes("T") ? new Date(dateVal).toLocaleDateString('vi-VN') : dateVal;
                                })()}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Avatar Preview Dialog */}
            <Dialog open={previewOpen} onOpenChange={(open) => !open && handleClosePreview()}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t("Xem trước ảnh đại diện")}</DialogTitle>
                    </DialogHeader>
                    
                    <div className="flex flex-col items-center justify-center p-6 space-y-4">
                        <div 
                            className="relative h-48 w-48 rounded-full overflow-hidden border-4 border-[hsl(var(--primary)/20)] shadow-2xl cursor-pointer group/preview"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <img 
                                src={previewUrl || getImageUrl(employee?.HinhAnh)} 
                                alt="Preview" 
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-smooth">
                                <IconCamera className="text-white size-8" />
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground text-center">
                            {previewUrl ? t("Nhấn vào ảnh để chọn lại") : t("Nhấn vào ảnh để chọn ảnh từ máy tính")}
                        </p>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button 
                            variant="outline" 
                            onClick={handleClosePreview}
                            disabled={isUploading}
                        >
                            {t("Hủy bỏ")}
                        </Button>
                        <Button 
                            onClick={handleSaveAvatar}
                            disabled={isUploading}
                            className="bg-[#6A30F7] hover:bg-[#5A20E7]"
                        >
                            {isUploading ? (
                                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            {t("Lưu thay đổi")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* Edit Profile Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editType === "personal" ? t("Sửa Thông Tin Cá Nhân") : t("Sửa Thông Tin Liên Hệ")}
                        </DialogTitle>
                        <DialogDescription>
                            {t("Nhập thông tin mới và Lưu thay đổi để lưu.")}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                        {editType === "personal" && (
                            <>
                                {/* Full Name */}
                                <div className="grid gap-2">
                                    <Label htmlFor="HoVaTen">{t("Họ Và Tên")}</Label>
                                    <Input 
                                        id="HoVaTen" 
                                        value={editFormData?.HoVaTen || ""} 
                                        onChange={(e) => setEditFormData(prev => prev ? {...prev, HoVaTen: e.target.value} : null)}
                                        className={errors.HoVaTen ? "border-red-500" : ""}
                                    />
                                    {errors.HoVaTen && <p className="text-xs text-red-500">{errors.HoVaTen}</p>}
                                </div>

                                 {/* Gender */}
                                <div className="grid gap-2">
                                    <Label htmlFor="GioiTinh">{t("Giới Tính")}</Label>
                                    <Select 
                                        value={editFormData?.GioiTinh} 
                                        onValueChange={(val) => setEditFormData(prev => prev ? {...prev, GioiTinh: val as any} : null)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("Chọn giới tính")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Nam">{t("Nam")}</SelectItem>
                                            <SelectItem value="Nữ">{t("Nữ")}</SelectItem>
                                            <SelectItem value="Khác">{t("Khác")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.GioiTinh && <p className="text-xs text-red-500">{errors.GioiTinh}</p>}
                                </div>

                                {/* Date of Birth */}
                                <div className="grid gap-2">
                                    <Label htmlFor="NgaySinh">{t("Ngày Sinh")}</Label>
                                    <Input 
                                        id="NgaySinh" 
                                        type="date"
                                        value={editFormData?.NgaySinh || ""} 
                                        onChange={(e) => setEditFormData(prev => prev ? {...prev, NgaySinh: e.target.value} : null)}
                                        className={errors.NgaySinh ? "border-red-500" : ""}
                                    />
                                    {errors.NgaySinh && <p className="text-xs text-red-500">{errors.NgaySinh}</p>}
                                </div>
                            </>
                        )}

                        {editType === "contact" && (
                            <>
                                {/* Phone Number */}
                                <div className="grid gap-2">
                                    <Label htmlFor="SDT">{t("SĐT")}</Label>
                                    <Input 
                                        id="SDT" 
                                        value={editFormData?.SDT || ""} 
                                        onChange={(e) => setEditFormData(prev => prev ? {...prev, SDT: e.target.value} : null)}
                                        className={errors.SDT ? "border-red-500" : ""}
                                    />
                                    {errors.SDT && <p className="text-xs text-red-500">{errors.SDT}</p>}
                                </div>

                                {/* Address */}
                                <div className="grid gap-2">
                                    <Label htmlFor="DiaChi">{t("Địa Chỉ")}</Label>
                                    <Input 
                                        id="DiaChi" 
                                        value={editFormData?.DiaChi || ""} 
                                        onChange={(e) => setEditFormData(prev => prev ? {...prev, DiaChi: e.target.value} : null)}
                                        className={errors.DiaChi ? "border-red-500" : ""}
                                    />
                                    {errors.DiaChi && <p className="text-xs text-red-500">{errors.DiaChi}</p>}
                                </div>
                            </>
                        )}
                    </div>

                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setIsEditOpen(false)}
                            disabled={isUploading}
                        >
                            {t("Huỷ")}
                        </Button>
                        <Button 
                            onClick={handleUpdateInfo}
                            disabled={isUploading}
                            className="bg-[#6A30F7] hover:bg-[#5A20E7]"
                        >
                            {isUploading && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t("Lưu thay đổi")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProfileComponent;
