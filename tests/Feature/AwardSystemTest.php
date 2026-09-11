<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Employee;
use App\Models\Nominee;
use App\Models\User;
use App\Models\Winner;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AwardSystemTest extends TestCase
{
    use RefreshDatabase;

    public function test_showcase_page_can_be_rendered(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }

    public function test_unauthenticated_user_cannot_access_admin_dashboard(): void
    {
        $response = $this->get('/admin/dashboard');
        $response->assertRedirect('/login');
    }

    public function test_admin_can_access_dashboard(): void
    {
        $admin = User::factory()->create([
            'role' => 'superadmin',
        ]);

        $response = $this->actingAs($admin)->get('/admin/dashboard');
        $response->assertStatus(200);
    }

    public function test_non_admin_cannot_access_dashboard(): void
    {
        $regularUser = User::factory()->create([
            'role' => 'user',
        ]);

        $response = $this->actingAs($regularUser)->get('/admin/dashboard');
        $response->assertStatus(403);
    }

    public function test_category_and_nominee_and_winner_flow(): void
    {
        $admin = User::factory()->create(['role' => 'superadmin']);

        // 1. Create Category
        $category = Category::create([
            'name' => 'Unit Test Category',
            'slug' => 'unit-test-category',
            'description' => 'Test description',
            'order' => 1,
            'is_active' => true,
        ]);
        $this->assertDatabaseHas('categories', ['slug' => 'unit-test-category']);

        // 2. Create Employee
        $employee = Employee::create([
            'name' => 'Test Employee',
            'position' => 'QA Engineer',
            'department' => 'Quality Assurance',
        ]);
        $this->assertDatabaseHas('employees', ['name' => 'Test Employee']);

        // 3. Assign Nominee
        $nominee = Nominee::create([
            'category_id' => $category->id,
            'employee_id' => $employee->id,
            'description' => 'Great performance',
            'order' => 1,
        ]);
        $this->assertDatabaseHas('nominees', [
            'category_id' => $category->id,
            'employee_id' => $employee->id,
        ]);

        // 4. Set Winner
        $winner = Winner::create([
            'category_id' => $category->id,
            'nominee_id' => $nominee->id,
            'announced_at' => now(),
        ]);
        $this->assertDatabaseHas('winners', [
            'category_id' => $category->id,
            'nominee_id' => $nominee->id,
        ]);
    }

    public function test_batch_assign_nominees_flow(): void
    {
        $admin = User::factory()->create(['role' => 'superadmin']);

        $category = Category::create([
            'name' => 'Batch Test Category',
            'slug' => 'batch-test-category',
            'order' => 1,
            'is_active' => true,
        ]);

        $emp1 = Employee::create(['name' => 'Employee 1', 'position' => 'Doctor', 'department' => 'Medis']);
        $emp2 = Employee::create(['name' => 'Employee 2', 'position' => 'Nurse', 'department' => 'Keperawatan']);
        $emp3 = Employee::create(['name' => 'Employee 3', 'position' => 'Pharmacist', 'department' => 'Farmasi']);

        $response = $this->actingAs($admin)->post(route('admin.nominees.store'), [
            'category_id' => $category->id,
            'employee_ids' => [$emp1->id, $emp2->id, $emp3->id],
            'description' => 'Nominasi batch berprestasi',
        ]);

        $response->assertRedirect(route('admin.nominees.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('nominees', [
            'category_id' => $category->id,
            'employee_id' => $emp1->id,
            'order' => 1,
        ]);
        $this->assertDatabaseHas('nominees', [
            'category_id' => $category->id,
            'employee_id' => $emp2->id,
            'order' => 2,
        ]);
        $this->assertDatabaseHas('nominees', [
            'category_id' => $category->id,
            'employee_id' => $emp3->id,
            'order' => 3,
        ]);
        $this->assertDatabaseCount('nominees', 3);
    }
}

