
import { useState, useEffect, useContext } from "react";
import Navbar from "@/components/Navbar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { LanguageContext, Language } from "../App";

const Settings = () => {
  const { language, setLanguage } = useContext(LanguageContext);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [storeName, setStoreName] = useState("Souk Connect");

  useEffect(() => {
    // Check for dark mode on component mount
    setIsDarkMode(document.documentElement.classList.contains("dark"));
    
    // Load store name from localStorage if it exists
    const savedStoreName = localStorage.getItem("store_name");
    if (savedStoreName) {
      setStoreName(savedStoreName);
    }
  }, []);

  const handleLanguageChange = (value: Language) => {
    setLanguage(value);
    toast.success(`Language changed to ${getLanguageName(value)}`);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      toast.success("Light mode activated");
    } else {
      document.documentElement.classList.add("dark");
      toast.success("Dark mode activated");
    }
  };

  const handleStoreNameChange = () => {
    localStorage.setItem("store_name", storeName);
    // Force refresh to update the navbar
    window.location.reload();
    toast.success(
      language === 'ar' ? 'تم تحديث اسم المتجر' :
      language === 'fr' ? 'Nom du magasin mis à jour' :
      'Store name updated'
    );
  };

  const getLanguageName = (code: Language) => {
    switch (code) {
      case "fr": return "Français";
      case "ar": return "العربية";
      case "en": return "English";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className={`container-custom pt-24 pb-16 animate-enter ${language === 'ar' ? 'rtl' : ''}`}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4 text-gradient">
              {language === 'ar' ? 'الإعدادات' : 
               language === 'fr' ? 'Paramètres' : 'Settings'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'ar' ? 'تخصيص تجربتك وتفضيلاتك' :
               language === 'fr' ? 'Personnalisez votre expérience et vos préférences' : 
               'Customize your experience and preferences'}
            </p>
          </div>
          
          <div className="space-y-10">
            {/* Store Name Settings */}
            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-full bg-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-store"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>
                </div>
                <div>
                  <h2 className="text-xl font-medium">
                    {language === 'ar' ? 'اسم المتجر' :
                     language === 'fr' ? 'Nom du Magasin' : 'Store Name'}
                  </h2>
                  <p className="text-muted-foreground">
                    {language === 'ar' ? 'تغيير اسم متجرك' :
                     language === 'fr' ? 'Changez le nom de votre magasin' : 
                     'Change your store name'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="store-name" className="text-sm font-medium">
                    {language === 'ar' ? 'اسم المتجر' :
                     language === 'fr' ? 'Nom du Magasin' : 'Store Name'}
                  </Label>
                  <Input
                    id="store-name"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <Button onClick={handleStoreNameChange}>
                  {language === 'ar' ? 'حفظ التغييرات' :
                   language === 'fr' ? 'Enregistrer les Modifications' : 
                   'Save Changes'}
                </Button>
              </div>
            </div>
            
            {/* Language Settings */}
            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-full bg-secondary">
                  <Globe className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-medium">
                    {language === 'ar' ? 'اللغة' :
                     language === 'fr' ? 'Langue' : 'Language'}
                  </h2>
                  <p className="text-muted-foreground">
                    {language === 'ar' ? 'اختر لغتك المفضلة' :
                     language === 'fr' ? 'Sélectionnez votre langue préférée' : 
                     'Select your preferred language'}
                  </p>
                </div>
              </div>
              
              <RadioGroup
                value={language}
                onValueChange={(value) => handleLanguageChange(value as Language)}
                className="gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fr" id="fr" />
                  <Label htmlFor="fr" className="flex items-center">
                    <span className="ml-2">Français</span>
                    <span className="ml-2 text-muted-foreground">🇫🇷</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ar" id="ar" />
                  <Label htmlFor="ar" className="flex items-center">
                    <span className="ml-2">العربية</span>
                    <span className="ml-2 text-muted-foreground">🇲🇦</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="en" id="en" />
                  <Label htmlFor="en" className="flex items-center">
                    <span className="ml-2">English</span>
                    <span className="ml-2 text-muted-foreground">🇬🇧</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Theme Settings */}
            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-full bg-secondary">
                  {isDarkMode ? (
                    <Moon className="h-6 w-6" />
                  ) : (
                    <Sun className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-medium">
                    {language === 'ar' ? 'المظهر' :
                     language === 'fr' ? 'Apparence' : 'Appearance'}
                  </h2>
                  <p className="text-muted-foreground">
                    {language === 'ar' ? 'التبديل بين الوضع الفاتح والداكن' :
                     language === 'fr' ? 'Basculer entre le mode clair et sombre' : 
                     'Toggle between light and dark mode'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="flex items-center gap-2">
                  {isDarkMode ? 
                    (language === 'ar' ? 'الوضع الداكن' : 
                     language === 'fr' ? 'Mode Sombre' : 'Dark Mode') : 
                    (language === 'ar' ? 'الوضع الفاتح' : 
                     language === 'fr' ? 'Mode Clair' : 'Light Mode')}
                </Label>
                <Switch
                  id="dark-mode"
                  checked={isDarkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
            </div>
            
            {/* Account Settings (Placeholder for future implementation) */}
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-medium mb-4">
                {language === 'ar' ? 'تفضيلات الحساب' :
                 language === 'fr' ? 'Préférences du compte' : 'Account Preferences'}
              </h2>
              <p className="text-muted-foreground mb-4">
                {language === 'ar' ? 'إدارة إعدادات وتفضيلات حسابك' :
                 language === 'fr' ? 'Gérez les paramètres et préférences de votre compte' : 
                 'Manage your account settings and preferences'}
              </p>
              <Button variant="outline" onClick={() => toast.info(
                language === 'ar' ? 'هذه الميزة قادمة قريبا' :
                language === 'fr' ? 'Cette fonctionnalité sera bientôt disponible' : 
                'This feature is coming soon'
              )}>
                {language === 'ar' ? 'إدارة الحساب' :
                 language === 'fr' ? 'Gérer le compte' : 'Manage Account'}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
