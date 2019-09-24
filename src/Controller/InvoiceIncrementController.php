<?php

namespace App\Controller;

use App\Entity\Invoice;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Routing\Annotation\Route;


class InvoiceIncrementController 
{
    /**
     * @var ObjectManager
     */
    private $manager;

    public function __construct(ObjectManager $manager)
    {
        $this->manager=$manager;
    }


    public function __invoke(Invoice $data) // permet 
    {
        //dd($data);// <=> var_dump($data);
        $data->setChrono(($data->getChrono()+1));
        $this->manager->flush();
        return $data; 
    }


    // /**
    //  * @Route("api/invoices/{id}/increment")
    //  *
    //  * @param Invoice $data
    //  * @return void
    //  */
    // public function __invoke(Invoice $data) // permet 
    // {
    //     $data->setChrono(($data->getChrono() + 1));
    //     dd($data);
    // }
}
