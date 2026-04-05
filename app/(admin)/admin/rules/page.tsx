export default function RulesPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Rules</h1>

      <p>
        Product rules and business logic configuration will be managed here.
      </p>

      <ul className="mt-4 list-disc pl-6">
        <li>Discount rules</li>
        <li>Visibility rules</li>
        <li>Availability constraints</li>
      </ul>
    </div>
  )
}
