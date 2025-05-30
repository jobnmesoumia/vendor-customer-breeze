
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  AlertCircle, 
  Eye,
  EyeOff,
  LogIn,
  Phone,
  Key,
  Copy,
  RefreshCw,
  Code,
  Upload
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductProps } from "@/components/ProductCard";
import { toast } from "sonner";
import { useWhatsAppAuth } from "@/hooks/useWhatsAppAuth";
import { LanguageContext, Language } from "@/App";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Mock data for demonstration
const mockSellerProducts: ProductProps[] = [
  {
    id: "1",
    title: "Handmade Moroccan Leather Babouches",
    price: 249,
    currency: "MAD",
    images: ["https://images.unsplash.com/photo-1608731267464-c0c889c2ff92?q=80&w=500&auto=format&fit=crop"],
    category: "Fashion",
    location: "Marrakech",
    seller: {
      id: "seller1",
      name: "Moroccan Crafts",
      whatsapp: "212600000000",
    },
  },
  {
    id: "2",
    title: "Argan Oil - 100% Pure & Organic",
    price: 120,
    currency: "MAD",
    images: ["https://images.unsplash.com/photo-1608571423902-abb9368e17ee?q=80&w=500&auto=format&fit=crop"],
    category: "Beauty",
    location: "Essaouira",
    seller: {
      id: "seller2",
      name: "Argan Cooperative",
      whatsapp: "212600000001",
    },
  },
];

// Mock function for Google authentication
const handleGoogleSignIn = () => {
  // In a real application, this would use Firebase, Auth0, or another auth provider
  // For demonstration, we'll simulate a successful login
  localStorage.setItem("google_auth", JSON.stringify({
    isAuthenticated: true,
    user: {
      id: "google_user_1",
      name: "Google User",
      email: "user@gmail.com",
      picture: "https://ui-avatars.com/api/?name=Google+User&background=random"
    }
  }));
  
  // Reload the page to reflect authentication state
  window.location.reload();
};

// Function to generate a random API key
const generateApiKey = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = '';
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
};

const SellerDashboard = () => {
  const { language } = useContext(LanguageContext);
  const { 
    isAuthenticated, 
    isLoading, 
    phoneNumber, 
    verificationCode,
    showVerification,
    setPhoneNumber,
    setVerificationCode,
    handleSendCode,
    handleVerifyCode,
    handleLogout
  } = useWhatsAppAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [storePhone, setStorePhone] = useState(phoneNumber || "212600000000");
  const [storeName, setStoreName] = useState("Souk Connect");
  const [storeLogo, setStoreLogo] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if authenticated with Google
    const googleAuth = localStorage.getItem("google_auth");
    if (googleAuth) {
      try {
        const { isAuthenticated } = JSON.parse(googleAuth);
        setIsGoogleAuthenticated(isAuthenticated);
      } catch (error) {
        console.error("Failed to parse Google auth:", error);
        localStorage.removeItem("google_auth");
      }
    }

    // Load saved API key if exists
    const savedApiKey = localStorage.getItem("seller_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }

    // Load saved store phone if exists
    const savedStorePhone = localStorage.getItem("store_phone");
    if (savedStorePhone) {
      setStorePhone(savedStorePhone);
    } else if (phoneNumber) {
      setStorePhone(phoneNumber);
    }
    
    // Load store name and logo from localStorage if they exist
    const savedStoreName = localStorage.getItem("store_name");
    if (savedStoreName) {
      setStoreName(savedStoreName);
    }

    const savedStoreLogo = localStorage.getItem("store_logo");
    if (savedStoreLogo) {
      setStoreLogo(savedStoreLogo);
    }

    // Simulating loading products after authentication
    if (isAuthenticated || isGoogleAuthenticated) {
      setProducts(mockSellerProducts);
    }
  }, [isAuthenticated, isGoogleAuthenticated, phoneNumber]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSendCode();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleVerifyCode();
  };

  const handleGoogleLogout = () => {
    localStorage.removeItem("google_auth");
    setIsGoogleAuthenticated(false);
    window.location.reload();
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
    toast.success(getTranslatedText("productDeletedSuccess"));
  };

  const handleGenerateApiKey = () => {
    const newApiKey = generateApiKey();
    setApiKey(newApiKey);
    localStorage.setItem("seller_api_key", newApiKey);
    toast.success(getTranslatedText("apiKeyGenerated"));
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success(getTranslatedText("apiKeyCopied"));
  };

  const handleSaveProfile = () => {
    localStorage.setItem("store_phone", storePhone);
    localStorage.setItem("store_name", storeName);
    
    // Force refresh to update the navbar
    window.location.reload();
    toast.success(getTranslatedText("profileUpdated"));
  };
  
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is jpg/jpeg
    if (!['image/jpeg', 'image/jpg'].includes(file.type)) {
      toast.error(getTranslatedText("jpgFormatRequired"));
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error(getTranslatedText("fileSizeTooLarge"));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setStoreLogo(base64String);
      localStorage.setItem("store_logo", base64String);
      toast.success(getTranslatedText("logoUpdated"));
    };
    reader.readAsDataURL(file);
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Translation function
  const getTranslatedText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      sellerLogin: {
        fr: "Connexion Vendeur",
        ar: "تسجيل دخول البائع",
        en: "Seller Login"
      },
      connectWhatsApp: {
        fr: "Connectez-vous avec votre compte WhatsApp",
        ar: "تواصل مع حساب الواتساب الخاص بك",
        en: "Connect with your WhatsApp account"
      },
      whatsAppNumber: {
        fr: "Numéro WhatsApp",
        ar: "رقم الواتساب",
        en: "WhatsApp Number"
      },
      sendCode: {
        fr: "Envoyer le Code",
        ar: "إرسال الرمز",
        en: "Send Code"
      },
      sendingCode: {
        fr: "Envoi du code...",
        ar: "جاري إرسال الرمز...",
        en: "Sending code..."
      },
      verificationCode: {
        fr: "Code de Vérification",
        ar: "رمز التحقق",
        en: "Verification Code"
      },
      enterCode: {
        fr: "Entrez le code à 6 chiffres",
        ar: "أدخل الرمز المكون من 6 أرقام",
        en: "Enter the 6-digit code"
      },
      codeInfo: {
        fr: "Entrez le code envoyé à +",
        ar: "أدخل الرمز المرسل إلى +",
        en: "Enter the code sent to +"
      },
      changeNumber: {
        fr: "Changer de numéro",
        ar: "تغيير الرقم",
        en: "Change number"
      },
      resendCode: {
        fr: "Renvoyer le code",
        ar: "إعادة إرسال الرمز",
        en: "Resend code"
      },
      verifying: {
        fr: "Vérification...",
        ar: "جاري التحقق...",
        en: "Verifying..."
      },
      login: {
        fr: "Se Connecter",
        ar: "تسجيل الدخول",
        en: "Login"
      },
      sellerDashboard: {
        fr: "Tableau de Bord Vendeur",
        ar: "لوحة تحكم البائع",
        en: "Seller Dashboard"
      },
      manageProducts: {
        fr: "Gérez vos produits et votre boutique",
        ar: "إدارة منتجاتك ومتجرك",
        en: "Manage your products and store"
      },
      logout: {
        fr: "Déconnexion",
        ar: "تسجيل الخروج",
        en: "Logout"
      },
      addProduct: {
        fr: "Ajouter un Produit",
        ar: "إضافة منتج",
        en: "Add Product"
      },
      products: {
        fr: "Produits",
        ar: "المنتجات",
        en: "Products"
      },
      profile: {
        fr: "Profil",
        ar: "الملف الشخصي",
        en: "Profile"
      },
      api: {
        fr: "API",
        ar: "واجهة برمجة التطبيقات",
        en: "API"
      },
      searchProducts: {
        fr: "Rechercher des produits...",
        ar: "البحث عن المنتجات...",
        en: "Search products..."
      },
      noProductsFound: {
        fr: "Aucun produit trouvé",
        ar: "لم يتم العثور على منتجات",
        en: "No products found"
      },
      tryDifferentSearch: {
        fr: "Essayez un terme de recherche différent",
        ar: "جرب مصطلح بحث مختلف",
        en: "Try a different search term"
      },
      startAddingProducts: {
        fr: "Commencez à ajouter des produits à votre boutique",
        ar: "ابدأ بإضافة منتجات إلى متجرك",
        en: "Start adding products to your store"
      },
      addFirstProduct: {
        fr: "Ajoutez Votre Premier Produit",
        ar: "أضف منتجك الأول",
        en: "Add Your First Product"
      },
      product: {
        fr: "Produit",
        ar: "المنتج",
        en: "Product"
      },
      category: {
        fr: "Catégorie",
        ar: "الفئة",
        en: "Category"
      },
      price: {
        fr: "Prix",
        ar: "السعر",
        en: "Price"
      },
      actions: {
        fr: "Actions",
        ar: "الإجراءات",
        en: "Actions"
      },
      storeInfo: {
        fr: "Informations sur la Boutique",
        ar: "معلومات المتجر",
        en: "Store Information"
      },
      storeName: {
        fr: "Nom de la Boutique",
        ar: "اسم المتجر",
        en: "Store Name"
      },
      location: {
        fr: "Emplacement",
        ar: "الموقع",
        en: "Location"
      },
      saveChanges: {
        fr: "Enregistrer les Modifications",
        ar: "حفظ التغييرات",
        en: "Save Changes"
      },
      deleteProduct: {
        fr: "Supprimer le Produit",
        ar: "حذف المنتج",
        en: "Delete Product"
      },
      deleteConfirmation: {
        fr: "Êtes-vous sûr de vouloir supprimer ce produit ? Cette action ne peut pas être annulée.",
        ar: "هل أنت متأكد من أنك تريد حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.",
        en: "Are you sure you want to delete this product? This action cannot be undone."
      },
      cancel: {
        fr: "Annuler",
        ar: "إلغاء",
        en: "Cancel"
      },
      delete: {
        fr: "Supprimer",
        ar: "حذف",
        en: "Delete"
      },
      productDeletedSuccess: {
        fr: "Produit supprimé avec succès",
        ar: "تم حذف المنتج بنجاح",
        en: "Product deleted successfully"
      },
      profileUpdated: {
        fr: "Profil mis à jour",
        ar: "تم تحديث الملف الشخصي",
        en: "Profile updated"
      },
      newCodeSent: {
        fr: "Nouveau code envoyé",
        ar: "تم إرسال رمز جديد",
        en: "New code sent"
      },
      orContinueWith: {
        fr: "Ou continuer avec",
        ar: "أو تابع مع",
        en: "Or continue with"
      },
      continueWithGoogle: {
        fr: "Continuer avec Google",
        ar: "تابع مع جوجل",
        en: "Continue with Google"
      },
      email: {
        fr: "E-mail",
        ar: "البريد الإلكتروني",
        en: "Email"
      },
      apiKeyManagement: {
        fr: "Gestion des Clés API",
        ar: "إدارة مفاتيح واجهة برمجة التطبيقات",
        en: "API Key Management"
      },
      generateApiKey: {
        fr: "Générer une Clé API",
        ar: "إنشاء مفتاح API",
        en: "Generate API Key"
      },
      regenerateApiKey: {
        fr: "Régénérer la Clé API",
        ar: "إعادة إنشاء مفتاح API",
        en: "Regenerate API Key"
      },
      apiKeyCopied: {
        fr: "Clé API copiée dans le presse-papiers",
        ar: "تم نسخ مفتاح API إلى الحافظة",
        en: "API Key copied to clipboard"
      },
      apiKeyGenerated: {
        fr: "Clé API générée avec succès",
        ar: "تم إنشاء مفتاح API بنجاح",
        en: "API Key generated successfully"
      },
      apiKeyWarning: {
        fr: "Ne partagez cette clé qu'avec des services de confiance. Elle donne accès à votre boutique.",
        ar: "شارك هذا المفتاح فقط مع الخدمات الموثوقة. يمنح الوصول إلى متجرك.",
        en: "Only share this key with trusted services. It grants access to your store."
      },
      apiDocumentation: {
        fr: "Documentation de l'API",
        ar: "وثائق واجهة برمجة التطبيقات",
        en: "API Documentation"
      },
      apiEndpoint: {
        fr: "Point de Terminaison API",
        ar: "نقطة نهاية API",
        en: "API Endpoint"
      },
      apiDocs: {
        fr: "Docs de l'API",
        ar: "وثائق API",
        en: "API Docs"
      },
      phoneNumber: {
        fr: "Numéro de téléphone",
        ar: "رقم الهاتف",
        en: "Phone Number"
      },
      jpgFormatRequired: {
        fr: "Le fichier doit être au format JPG",
        ar: "يجب أن يكون الملف بتنسيق JPG",
        en: "File must be in JPG format"
      },
      fileSizeTooLarge: {
        fr: "La taille du fichier doit être inférieure à 2 Mo",
        ar: "يجب أن يكون حجم الملف أقل من 2 ميغابايت",
        en: "File size must be less than 2MB"
      },
      logoUpdated: {
        fr: "Logo mis à jour",
        ar: "تم تحديث الشعار",
        en: "Logo updated"
      },
      storeLogo: {
        fr: "Logo de la Boutique",
        ar: "شعار المتجر",
        en: "Store Logo"
      },
      uploadLogo: {
        fr: "Télécharger un logo (JPG)",
        ar: "تحميل شعار (JPG)",
        en: "Upload logo (JPG)"
      }
    };

    return translations[key]?.[language] || translations[key]?.en || key;
  };

  if (!isAuthenticated && !isGoogleAuthenticated) {
    return (
      <div className="min-h-screen">
        <Navbar />
        
        <main className={`container-custom pt-24 pb-16 animate-enter ${language === 'ar' ? 'rtl' : ''}`}>
          <div className="max-w-md mx-auto glass rounded-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2 text-gradient">{getTranslatedText("sellerLogin")}</h1>
              <p className="text-muted-foreground">
                {getTranslatedText("connectWhatsApp")}
              </p>
            </div>
            
            {!showVerification ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium">
                    {getTranslatedText("whatsAppNumber")}
                  </label>
                  <div className="relative">
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="212 6XX XXX XXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-12"
                      required
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      +
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'سنرسل لك رمز تحقق على واتساب' :
                     language === 'fr' ? 'Nous vous enverrons un code de vérification sur WhatsApp' :
                     "We'll send you a verification code on WhatsApp"}
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full btn-whatsapp"
                  disabled={isLoading}
                >
                  {isLoading ? getTranslatedText("sendingCode") : getTranslatedText("sendCode")}
                </Button>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      {getTranslatedText("orContinueWith")}
                    </span>
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleGoogleSignIn}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.6,20H24v8h11.3c-1.1,5.2-5.5,8-11.3,8c-6.6,0-12-5.4-12-12s5.4-12,12-12c3,0,5.8,1.1,7.9,3l6-6 C33.7,5.9,29,4,24,4C13,4,4,13,4,24s9,20,20,20s19-9,19-20C43,22.7,42.9,21.3,43.6,20z"/>
                    <path fill="#FF3D00" d="M6.3,14.7l7,5.4c1.8-5.1,6.7-8.1,12.8-8.1c3,0,5.8,1.1,7.9,3l6-6C33.7,5.9,29,4,24,4 C16.8,4,10.4,8.3,6.3,14.7z"/>
                    <path fill="#4CAF50" d="M24,44c4.9,0,9.5-1.8,12.9-4.9l-6.6-5.2c-1.8,1.2-4.3,2.1-6.3,2.1c-5.8,0-10.2-3.9-11.3-9.1l-6.8,5.2 C9.1,39.3,16.1,44,24,44z"/>
                    <path fill="#1976D2" d="M43.6,20H24v8h11.3c-0.5,2.6-2.1,4.8-4.2,6.3l0,0l6.6,5.2c-0.4,0.3,6.7-4.9,6.7-15.5 C43,22.7,42.9,21.3,43.6,20z"/>
                  </svg>
                  {getTranslatedText("continueWithGoogle")}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="code" className="block text-sm font-medium">
                    {getTranslatedText("verificationCode")}
                  </label>
                  <div className="relative">
                    <Input
                      id="code"
                      type={showPassword ? "text" : "password"}
                      placeholder={getTranslatedText("enterCode")}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {getTranslatedText("codeInfo")}{phoneNumber}
                  </p>
                </div>
                
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    className="text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => setPhoneNumber("")}
                  >
                    {getTranslatedText("changeNumber")}
                  </button>
                  <button
                    type="button"
                    className="text-sm text-muted-foreground hover:text-foreground"
                    onClick={async () => {
                      await handleSendCode();
                      setVerificationCode("");
                      toast.info(getTranslatedText("newCodeSent"));
                    }}
                  >
                    {getTranslatedText("resendCode")}
                  </button>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? getTranslatedText("verifying") : getTranslatedText("login")}
                </Button>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      {getTranslatedText("orContinueWith")}
                    </span>
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleGoogleSignIn}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.6,20H24v8h11.3c-1.1,5.2-5.5,8-11.3,8c-6.6,0-12-5.4-12-12s5.4-12,12-12c3,0,5.8,1.1,7.9,3l6-6 C33.7,5.9,29,4,24,4C13,4,4,13,4,24s9,20,20,20s19-9,19-20C43,22.7,42.9,21.3,43.6,20z"/>
                    <path fill="#FF3D00" d="M6.3,14.7l7,5.4c1.8-5.1,6.7-8.1,12.8-8.1c3,0,5.8,1.1,7.9,3l6-6C33.7,5.9,29,4,24,4 C16.8,4,10.4,8.3,6.3,14.7z"/>
                    <path fill="#4CAF50" d="M24,44c4.9,0,9.5-1.8,12.9-4.9l-6.6-5.2c-1.8,1.2-4.3,2.1-6.3,2.1c-5.8,0-10.2-3.9-11.3-9.1l-6.8,5.2 C9.1,39.3,16.1,44,24,44z"/>
                    <path fill="#1976D2" d="M43.6,20H24v8h11.3c-0.5,2.6-2.1,4.8-4.2,6.3l0,0l6.6,5.2c-0.4,0.3,6.7-4.9,6.7-15.5 C43,22.7,42.9,21.3,43.6,20z"/>
                  </svg>
                  {getTranslatedText("continueWithGoogle")}
                </Button>
              </form>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${language === 'ar' ? 'rtl' : ''}`}>
      <Navbar />
      
      <main className="container-custom pt-24 pb-16 animate-enter">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gradient">{getTranslatedText("sellerDashboard")}</h1>
            <p className="text-muted-foreground">
              {getTranslatedText("manageProducts")}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={isGoogleAuthenticated ? handleGoogleLogout : handleLogout}
            >
              {getTranslatedText("logout")}
            </Button>
            <Button asChild>
              <Link to="/seller/add-product">
                <Plus className="h-5 w-5 mr-2" />
                {getTranslatedText("addProduct")}
              </Link>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="products" className="space-y-4">
          <TabsList>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>{getTranslatedText("products")}</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              {getTranslatedText("profile")}
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span>{getTranslatedText("api")}</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder={getTranslatedText("searchProducts")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button asChild>
                <Link to="/seller/add-product">
                  <Plus className="h-5 w-5 mr-2" />
                  {getTranslatedText("addProduct")}
                </Link>
              </Button>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="glass rounded-lg p-8 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium mb-2">{getTranslatedText("noProductsFound")}</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm ? getTranslatedText("tryDifferentSearch") : getTranslatedText("startAddingProducts")}
                </p>
                {!searchTerm && (
                  <Button asChild>
                    <Link to="/seller/add-product">
                      <Plus className="h-5 w-5 mr-2" />
                      {getTranslatedText("addFirstProduct")}
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="rounded-lg overflow-hidden border glass">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{getTranslatedText("product")}</TableHead>
                      <TableHead className="hidden md:table-cell">{getTranslatedText("category")}</TableHead>
                      <TableHead className="text-right">{getTranslatedText("price")}</TableHead>
                      <TableHead className="text-right">{getTranslatedText("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded overflow-hidden">
                              <img
                                src={product.images[0]}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <Link 
                                to={`/products/${product.id}`}
                                className="font-medium hover:underline"
                              >
                                {product.title}
                              </Link>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {product.category}
                        </TableCell>
                        <TableCell className="text-right">
                          {product.price} {product.currency}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="minimal" 
                              size="minimal" 
                              asChild
                            >
                              <Link to={`/seller/edit-product/${product.id}`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="minimal" size="minimal" className="text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>{getTranslatedText("deleteProduct")}</DialogTitle>
                                  <DialogDescription>
                                    {getTranslatedText("deleteConfirmation")}
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button variant="outline">
                                    {getTranslatedText("cancel")}
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    onClick={() => handleDeleteProduct(product.id)}
                                  >
                                    {getTranslatedText("delete")}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="profile" className="space-y-6">
            <div className="glass rounded-lg p-8">
              <h3 className="text-xl font-medium mb-6">{getTranslatedText("storeInfo")}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="storeName" className="block text-sm font-medium mb-1">
                      {getTranslatedText("storeName")}
                    </label>
                    <Input
                      id="storeName"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="storePhone" className="block text-sm font-medium mb-1">
                      {getTranslatedText("phoneNumber")}
                    </label>
                    <div className="relative">
                      <Input
                        id="storePhone"
                        type="tel"
                        placeholder="212 6XX XXX XXX"
                        value={storePhone}
                        onChange={(e) => setStorePhone(e.target.value)}
                        className="pl-12"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        +
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {getTranslatedText("storeLogo")}
                    </label>
                    
                    <div className="flex items-center gap-4">
                      <div className="h-24 w-24 rounded-lg border overflow-hidden bg-muted flex items-center justify-center">
                        {storeLogo ? (
                          <img 
                            src={storeLogo} 
                            alt={storeName} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="text-3xl font-bold text-center text-muted-foreground">
                            {storeName?.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="logo-upload" className="cursor-pointer">
                          <div className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md transition-colors">
                            <Upload className="h-4 w-4" />
                            <span>{getTranslatedText("uploadLogo")}</span>
                          </div>
                          <input
                            id="logo-upload"
                            type="file"
                            accept=".jpg,.jpeg"
                            className="sr-only"
                            onChange={handleLogoUpload}
                          />
                        </label>
                        <p className="text-xs text-muted-foreground mt-2">
                          JPG/JPEG, max 2MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button onClick={handleSaveProfile}>
                  {getTranslatedText("saveChanges")}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-6">
            <div className="glass rounded-lg p-8">
              <h3 className="text-xl font-medium mb-6">{getTranslatedText("apiKeyManagement")}</h3>
              
              <div className="space-y-6">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      {getTranslatedText("apiKeyManagement")}
                    </label>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={handleCopyApiKey}
                        disabled={!apiKey}
                      >
                        <Copy className="h-4 w-4" />
                        <span className="sr-only md:not-sr-only">{getTranslatedText("copy")}</span>
                      </Button>
                      
                      <Button 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={handleGenerateApiKey}
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>{apiKey ? getTranslatedText("regenerateApiKey") : getTranslatedText("generateApiKey")}</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-2 glass rounded-md p-3 font-mono text-sm">
                    {apiKey || "••••••••••••••••••••••••••••••••"}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    {getTranslatedText("apiKeyWarning")}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-lg font-medium mb-4">{getTranslatedText("apiDocumentation")}</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {getTranslatedText("apiEndpoint")}
                      </label>
                      <code className="block p-3 rounded-md glass text-sm">
                        https://api.soukconnect.com/v1
                      </code>
                    </div>
                    
                    <Button asChild>
                      <Link to="/seller/api-docs">
                        <Code className="h-5 w-5 mr-2" />
                        {getTranslatedText("apiDocs")}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SellerDashboard;
