export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-auto">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
        
        {/* Colonne 1 - Logo & Description */}
        <div>
          <h2 className="text-2xl font-bold">JobBox</h2>
          <p className="mt-3 text-gray-400">
            The best platform to find your dream job easily and quickly.
          </p>
        </div>

        {/* Colonne 2 - Liens Rapides */}
        <div>
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="mt-3 space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-white">Find a Job</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white">Recruiters</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white">Candidates</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
          </ul>
        </div>

        {/* Colonne 3 - Support */}
        <div>
          <h3 className="text-lg font-semibold">Support</h3>
          <ul className="mt-3 space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
          </ul>
        </div>

        {/* Colonne 4 - Contact */}
        <div>
          <h3 className="text-lg font-semibold">Contact</h3>
          <p className="mt-3 text-gray-400">123 Main Street, City, Country</p>
          <p className="text-gray-400">Email: support@jobbox.com</p>
          <p className="text-gray-400">Phone: +123 456 7890</p>

          {/* Icônes réseaux sociaux */}
          <div className="flex mt-4 space-x-4">
            <a href="#" className="text-gray-400 hover:text-white text-xl">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-xl">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-xl">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 text-sm mt-8">
        © {new Date().getFullYear()} JobBox. All rights reserved.
      </div>
    </footer>
  );
}
