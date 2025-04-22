import React from "react";
import { useStorageProvider } from '@/storage/StorageProvider'
import SocialIcon from './SocialIcon'

const formatUrl = (href) => {
  if (href.substr(0,1) == '/') return `#${href}`
  return href
}
const Footer = () => {
  const {
    storageData: {
      footerMenu,
      socialLinks,
      exdata: {
        whitelabel,
      }
    }
  } = useStorageProvider()
  

  return (
    <footer className="bg-white py-8 mt-4 border-t-2 pt-8">
      <div className="container mx-auto px-4">
        {/* Логотип и основная информация */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            {/*
            <img src="logo.png" alt="Staking Platform Logo" className="h-12 mb-4" />
            */}
            <p className="text-sm text-gray-500">
              {whitelabel.footerSlogan}
            </p>
          </div>

          {/* Навигация */}
          <div>
            <nav className="mb-6 md:mb-0">
              <ul className="flex space-x-4 font-bold justify-end">
                {footerMenu.map((item, key) => {
                  const { title, url, blank } = item
                  return (
                    <li key={key}>
                      <a
                        href={formatUrl(url)}
                        className="text-gray-700 hover:text-gray-900"
                        {...((blank) ? { target: '_blank' } : {})}
                      >
                        {title}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </nav>

          {/* Социальные сети */}
          {socialLinks.length > 0 && (
            <div>
              {`Follow us on social media`}
              <div className="flex justify-center">
                {socialLinks.map((item, key) => {
                  const { socialType, title, url } = item
                  return (
                    <a key={key} target={`_blank`} href={url} className="text-gray-700 hover:text-gray-900" alt={title} title={title}>
                      <SocialIcon type={socialType} />
                    </a>
                  )
                })}
              </div>
            </div>
          )}
          </div>
          
        </div>

        {/* Нижняя часть - Copyright */}
        <div className="mt-8 border-t border-gray-200 pt-4 text-center text-sm text-gray-500">
          {whitelabel.footerCopyright.replace('[YEAR]', new Date().getFullYear())}
        </div>
      </div>
    </footer>
  );
};

export default Footer;