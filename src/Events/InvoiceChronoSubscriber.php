<?php

namespace  App\Events;

use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;
use Symfony\Component\Security\Core\Security;

class InvoiceChronoSubscriber implements EventSubscriberInterface
{

    private $security;
    private $repository;

    public function __construct(Security $security,InvoiceRepository $repository)
    {
        $this->security = $security;
        $this->repository = $repository;   
    }

    public static  function getSubscribedEvents()
    {
        return  [
            KernelEvents::VIEW => ['setChronoForInvoice', EventPriorities::PRE_VALIDATE]
        ];
    }


    public function setChronoForInvoice(GetResponseForControllerResultEvent $event) 
    {
        $invoice = $event->getControllerResult();
        $method = $event->getRequest()->getMethod(); // GET POST PUT .....

        if ($invoice instanceof Invoice && $method === "POST") {
            $nextChrono= $this->repository->findNextChrono($this->security->getUser());
            $invoice->setChrono($nextChrono);
            //dd($invoice);

            if (empty($invoice->getSentAt())) {
               $invoice->setSentAt(new \DateTime());
            }
        }
    }
}
