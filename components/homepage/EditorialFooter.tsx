"use client"

import Link from 'next/link'
import { COMPANY_INFO } from '@/lib/constants'

export function EditorialFooter() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-[1600px] mx-auto px-12 py-24">
        {/* Top section */}
        <div className="grid lg:grid-cols-12 gap-16 mb-24">
          {/* Brand */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4 mb-8">
              {/* Stacked bars logo */}
              <div className="flex flex-col gap-[3px] w-7">
                <div className="h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                <div className="h-[2px] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-[80%]" />
                <div className="h-[2px] bg-gradient-to-r from-pink-500 to-orange-500 rounded-full w-[70%]" />
                <div className="h-[2px] bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full w-[90%]" />
              </div>

              {/* Divider */}
              <div className="h-8 w-px bg-gradient-to-b from-blue-500 to-purple-500 opacity-50" />

              <span className="text-2xl font-light tracking-tight">AI 4U</span>
            </div>
            <p className="text-lg font-light text-gray-400 leading-relaxed max-w-md">
              A full-stack AI development studio based in Naples, Florida.
              We build and ship AI products to production.
            </p>
          </div>

          {/* Links */}
          <div className="lg:col-span-7">
            <div className="grid md:grid-cols-3 gap-12">
              {/* Company */}
              <div>
                <h4 className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-6">
                  Company
                </h4>
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="/about"
                      className="text-base font-light text-gray-300 hover:text-white transition-colors"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/work"
                      className="text-base font-light text-gray-300 hover:text-white transition-colors"
                    >
                      Work
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/services"
                      className="text-base font-light text-gray-300 hover:text-white transition-colors"
                    >
                      Services
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-6">
                  Legal
                </h4>
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="/privacy"
                      className="text-base font-light text-gray-300 hover:text-white transition-colors"
                    >
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="text-base font-light text-gray-300 hover:text-white transition-colors"
                    >
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-6">
                  Contact
                </h4>
                <ul className="space-y-4">
                  <li>
                    <a
                      href={`mailto:${COMPANY_INFO.email}`}
                      className="text-base font-light text-gray-300 hover:text-white transition-colors"
                    >
                      {COMPANY_INFO.email}
                    </a>
                  </li>
                  <li className="text-base font-light text-gray-400">
                    {COMPANY_INFO.location}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm font-light text-gray-500">
            © {new Date().getFullYear()} {COMPANY_INFO.name}
          </p>
          <div className="flex items-center gap-8">
            <a
              href={COMPANY_INFO.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-light uppercase tracking-wider text-gray-500 hover:text-white transition-colors"
            >
              Twitter
            </a>
            <a
              href={COMPANY_INFO.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-light uppercase tracking-wider text-gray-500 hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={COMPANY_INFO.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-light uppercase tracking-wider text-gray-500 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
