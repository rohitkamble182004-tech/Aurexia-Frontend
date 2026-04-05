import ClimateForm from './ClimateForm'
import LookForm from './LookForm'
import EditForm from './EditForm'

export default function AttributesPage() {
  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-2xl font-semibold">Attributes</h1>
        <p className="text-muted-foreground">
          Editorial attributes used to organize the storefront.
        </p>
      </header>

      <section>
        <h2 className="text-xl font-medium mb-4">By Climate</h2>
        <ClimateForm />
      </section>

      <section>
        <h2 className="text-xl font-medium mb-4">Looks</h2>
        <LookForm />
      </section>

      <section>
        <h2 className="text-xl font-medium mb-4">The Edit</h2>
        <EditForm />
      </section>
    </div>
  )
}
